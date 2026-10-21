import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from './app.js';

let server;
let baseUrl;
const publishedEvents = [];

before(async () => {
  server = createApp({
    publishEvent: async (eventType, data) => publishedEvents.push({ eventType, data }),
  }).listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

const jsonRequest = async (path, { method = 'GET', body, token } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return {
    response,
    data: response.status === 204 ? null : await response.json(),
  };
};

const login = async (email, password) => {
  const { response, data } = await jsonRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  assert.equal(response.status, 200);
  assert.ok(data.token);
  return data;
};

test('health check, category listing, and product filters are available', async () => {
  const health = await jsonRequest('/health');
  assert.equal(health.response.status, 200);
  assert.deepEqual(health.data, { status: 'ok' });

  const categories = await jsonRequest('/categories');
  assert.equal(categories.response.status, 200);
  assert.ok(categories.data.some((category) => category.name === 'Bebidas'));

  const products = await jsonRequest('/products?category=Bebidas&sort=discount');
  assert.equal(products.response.status, 200);
  assert.ok(products.data.length > 0);
  assert.ok(products.data.every((product) => product.category === 'Bebidas'));
  assert.ok(products.data[0].discount >= products.data.at(-1).discount);
});

test('product write routes require an admin and return REST status codes', async () => {
  const unauthorized = await jsonRequest('/products', {
    method: 'POST',
    body: { name: 'Produto' },
  });
  assert.equal(unauthorized.response.status, 401);
  assert.equal(unauthorized.data.error.code, 'unauthorized');

  const admin = await login('admin@foodpromotion.com', 'admin123');
  const created = await jsonRequest('/products', {
    method: 'POST',
    token: admin.token,
    body: {
      name: 'Produto de teste',
      category: 'Bebidas',
      originalPrice: 10,
      promoPrice: 5,
      discount: 50,
      stock: 3,
      expiresAt: '2027-01-01',
    },
  });
  assert.equal(created.response.status, 201);

  const updated = await jsonRequest(`/products/${created.data.id}`, {
    method: 'PUT',
    token: admin.token,
    body: { stock: 4 },
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.data.stock, 4);

  const deleted = await jsonRequest(`/products/${created.data.id}`, {
    method: 'DELETE',
    token: admin.token,
  });
  assert.equal(deleted.response.status, 204);
  assert.equal(deleted.data, null);
});

test('registration issues a token and rejects duplicate e-mail addresses', async () => {
  const registration = await jsonRequest('/auth/register', {
    method: 'POST',
    body: { name: 'Nova Cliente', email: 'nova@example.com', password: 'senha-segura' },
  });
  assert.equal(registration.response.status, 201);
  assert.ok(registration.data.token);
  assert.equal(Object.hasOwn(registration.data, 'password'), false);

  const duplicate = await jsonRequest('/auth/register', {
    method: 'POST',
    body: { name: 'Outra Cliente', email: 'NOVA@example.com', password: 'outra-senha' },
  });
  assert.equal(duplicate.response.status, 409);
  assert.equal(duplicate.data.error.code, 'email_exists');
});

test('orders are scoped to the authenticated client and stock conflicts are reported', async () => {
  const client = await login('maria@email.com', 'cliente123');
  const orders = await jsonRequest('/orders', { token: client.token });
  assert.equal(orders.response.status, 200);
  assert.ok(orders.data.every((order) => order.clientId === client.id));

  const forbidden = await jsonRequest('/orders/1041', { token: client.token });
  assert.equal(forbidden.response.status, 403);

  const unavailable = await jsonRequest('/orders', {
    method: 'POST',
    token: client.token,
    body: {
      items: [{ productId: 1, qty: 999 }],
      delivery: 'pickup',
      payment: 'pix',
    },
  });
  assert.equal(unavailable.response.status, 409);
  assert.equal(unavailable.data.error.code, 'unavailable_product');

  const duplicateItems = await jsonRequest('/orders', {
    method: 'POST',
    token: client.token,
    body: {
      items: [
        { productId: 8, qty: 20 },
        { productId: 8, qty: 20 },
      ],
      delivery: 'pickup',
      payment: 'pix',
    },
  });
  assert.equal(duplicateItems.response.status, 409);
});

test('order status changes are published to the messaging broker', async () => {
  const admin = await login('admin@foodpromotion.com', 'admin123');
  const updated = await jsonRequest('/orders/1041/status', {
    method: 'PATCH',
    token: admin.token,
    body: { status: 'done' },
  });

  assert.equal(updated.response.status, 200);
  assert.equal(updated.data.status, 'done');
  assert.deepEqual(publishedEvents.at(-1), {
    eventType: 'order.status_changed',
    data: { orderId: 1041, clientId: 3, previousStatus: 'waiting', status: 'done' },
  });
});

test('new orders are published with their order data', async () => {
  const events = [];
  const isolatedServer = createApp({
    publishEvent: async (eventType, data) => events.push({ eventType, data }),
    now: () => new Date('2026-10-01T12:00:00.000Z'),
  }).listen(0, '127.0.0.1');
  await new Promise((resolve) => isolatedServer.once('listening', resolve));
  const isolatedBaseUrl = `http://127.0.0.1:${isolatedServer.address().port}/api`;

  try {
    const loginResponse = await fetch(`${isolatedBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'maria@email.com', password: 'cliente123' }),
    });
    const client = await loginResponse.json();
    const orderResponse = await fetch(`${isolatedBaseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${client.token}`,
      },
      body: JSON.stringify({
        items: [{ productId: 1, qty: 1 }],
        delivery: 'pickup',
        payment: 'pix',
      }),
    });
    const order = await orderResponse.json();

    assert.equal(orderResponse.status, 201);
    assert.equal(events.length, 1);
    assert.equal(events[0].eventType, 'order.created');
    assert.equal(events[0].data.id, order.id);
    assert.equal(events[0].data.status, 'waiting');
  } finally {
    await new Promise((resolve, reject) =>
      isolatedServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test('concurrent orders cannot oversell stock while publishing events', async () => {
  const events = [];
  const isolatedServer = createApp({
    publishEvent: async (eventType, data) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      events.push({ eventType, data });
    },
    now: () => new Date('2026-10-01T12:00:00.000Z'),
  }).listen(0, '127.0.0.1');
  await new Promise((resolve) => isolatedServer.once('listening', resolve));
  const isolatedBaseUrl = `http://127.0.0.1:${isolatedServer.address().port}/api`;

  try {
    const loginResponse = await fetch(`${isolatedBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'maria@email.com', password: 'cliente123' }),
    });
    const client = await loginResponse.json();
    const createOrder = () =>
      fetch(`${isolatedBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${client.token}`,
        },
        body: JSON.stringify({
          items: [{ productId: 1, qty: 8 }],
          delivery: 'pickup',
          payment: 'pix',
        }),
      });

    const responses = await Promise.all([createOrder(), createOrder()]);
    assert.deepEqual(
      responses.map((response) => response.status).sort(),
      [201, 409],
    );
    assert.equal(events.length, 1);
  } finally {
    await new Promise((resolve, reject) =>
      isolatedServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test('concurrent status changes publish the correct previous status', async () => {
  const events = [];
  const isolatedServer = createApp({
    publishEvent: async (eventType, data) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      events.push({ eventType, data });
    },
  }).listen(0, '127.0.0.1');
  await new Promise((resolve) => isolatedServer.once('listening', resolve));
  const isolatedBaseUrl = `http://127.0.0.1:${isolatedServer.address().port}/api`;

  try {
    const loginResponse = await fetch(`${isolatedBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@foodpromotion.com', password: 'admin123' }),
    });
    const admin = await loginResponse.json();
    const changeStatus = (status) =>
      fetch(`${isolatedBaseUrl}/orders/1041/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify({ status }),
      });

    const responses = await Promise.all([changeStatus('done'), changeStatus('canceled')]);
    assert.deepEqual(responses.map((response) => response.status), [200, 200]);
    assert.deepEqual(
      events.map(({ data }) => [data.previousStatus, data.status]),
      [
        ['waiting', 'done'],
        ['done', 'canceled'],
      ],
    );
  } finally {
    await new Promise((resolve, reject) =>
      isolatedServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test('a failed event publish leaves an order status unchanged', async () => {
  const isolatedServer = createApp({
    publishEvent: async () => {
      throw new Error('RabbitMQ indisponível');
    },
  }).listen(0, '127.0.0.1');
  await new Promise((resolve) => isolatedServer.once('listening', resolve));
  const isolatedBaseUrl = `http://127.0.0.1:${isolatedServer.address().port}/api`;

  try {
    const adminResponse = await fetch(`${isolatedBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@foodpromotion.com', password: 'admin123' }),
    });
    const admin = await adminResponse.json();
    const updateResponse = await fetch(`${isolatedBaseUrl}/orders/1041/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${admin.token}`,
      },
      body: JSON.stringify({ status: 'done' }),
    });
    const updateError = await updateResponse.json();
    const orderResponse = await fetch(`${isolatedBaseUrl}/orders/1041`, {
      headers: { Authorization: `Bearer ${admin.token}` },
    });
    const order = await orderResponse.json();

    assert.equal(updateResponse.status, 503);
    assert.equal(updateError.error.code, 'messaging_unavailable');
    assert.equal(order.status, 'waiting');
  } finally {
    await new Promise((resolve, reject) =>
      isolatedServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test('invalid query parameters and unknown routes return the common error format', async () => {
  const invalidQuery = await jsonRequest('/products?sort=unknown');
  assert.equal(invalidQuery.response.status, 400);
  assert.equal(invalidQuery.data.error.code, 'invalid_query');

  const missing = await jsonRequest('/products/99999');
  assert.equal(missing.response.status, 404);
  assert.equal(missing.data.error.code, 'not_found');

  const missingRoute = await jsonRequest('/does-not-exist');
  assert.equal(missingRoute.response.status, 404);
  assert.equal(missingRoute.data.error.code, 'not_found');
});
