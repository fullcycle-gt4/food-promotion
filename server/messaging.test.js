import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { test } from 'node:test';
import {
  assertMessagingTopology,
  DEAD_LETTER_EXCHANGE,
  DEAD_LETTER_QUEUE,
  ORDERS_QUEUE,
  createEventPublisher,
} from './messaging.js';
import { ORDER_EVENT_TYPES } from './events.js';
import {
  BASE_RETRY_DELAY_MS,
  DEFAULT_QUEUE_NAMES,
  createQueueNames,
  MAX_RETRY_ATTEMPTS,
} from './queueConfig.js';
import { createOrderEventHandler } from './orderEventConsumer.js';

class FakeChannel extends EventEmitter {
  exchanges = [];
  queues = [];
  bindings = [];
  messages = [];
  acknowledgements = [];
  rejections = [];
  closed = false;

  async assertExchange(...args) {
    this.exchanges.push(args);
  }

  async assertQueue(...args) {
    this.queues.push(args);
  }

  async bindQueue(...args) {
    this.bindings.push(args);
  }

  async prefetch() {}

  ack(message) {
    this.acknowledgements.push(message);
  }

  nack(...args) {
    this.rejections.push(args);
  }

  sendToQueue(queue, body, options) {
    this.messages.push({ queue, body, options });
    return true;
  }

  async waitForConfirms() {}

  async close() {
    this.closed = true;
    this.emit('close');
  }
}

class FakeConnection extends EventEmitter {
  channels = [];
  closed = false;

  async createConfirmChannel() {
    const channel = new FakeChannel();
    this.channels.push(channel);
    return channel;
  }

  async close() {
    this.closed = true;
    this.emit('close');
  }
}

test('messaging topology declares durable order and dead-letter queues', async () => {
  const channel = new FakeChannel();
  await assertMessagingTopology(channel);
  const deadLetterBinding = channel.bindings.find(
    ([queue, exchange, routingKey]) =>
      queue === DEAD_LETTER_QUEUE && exchange === DEAD_LETTER_EXCHANGE,
  );
  const mainQueue = channel.queues.find(([name]) => name === ORDERS_QUEUE);

  assert.ok(channel.exchanges.some(([name, type, options]) =>
    name === DEAD_LETTER_EXCHANGE && type === 'direct' && options.durable,
  ));
  assert.ok(channel.queues.some(([name, options]) =>
    name === DEAD_LETTER_QUEUE && options.durable,
  ));
  assert.deepEqual(mainQueue, [
    ORDERS_QUEUE,
    {
      durable: true,
      deadLetterExchange: DEAD_LETTER_EXCHANGE,
      deadLetterRoutingKey: 'orders.events.dead-letter',
    },
  ]);
  assert.deepEqual(deadLetterBinding, [
    DEAD_LETTER_QUEUE,
    DEAD_LETTER_EXCHANGE,
    'orders.events.dead-letter',
  ]);
  assert.ok(
    channel.queues.some(
      ([name, options]) =>
        name === DEFAULT_QUEUE_NAMES.retries[0].name &&
        options.durable &&
        options.messageTtl === BASE_RETRY_DELAY_MS &&
        options.deadLetterExchange === '' &&
        options.deadLetterRoutingKey === ORDERS_QUEUE,
    ),
  );
});

test('event publisher confirms persistent messages and reconnects after broker close', async () => {
  const connections = [];
  const amqpClient = {
    async connect(url) {
      assert.equal(url, 'amqp://localhost');
      const connection = new FakeConnection();
      connections.push(connection);
      return connection;
    },
  };
  const publisher = await createEventPublisher({ url: 'amqp://localhost', amqpClient });

  try {
    const first = await publisher.publish(ORDER_EVENT_TYPES.CREATED, {
      id: 101,
      clientId: 2,
      status: 'waiting',
      items: [{ productId: 1, qty: 1 }],
    });
    const firstChannel = connections[0].channels[0];
    const publishedMessage = firstChannel.messages[0];
    const envelope = JSON.parse(publishedMessage.body.toString());

    assert.equal(publishedMessage.queue, ORDERS_QUEUE);
    assert.equal(publishedMessage.options.persistent, true);
    assert.equal(publishedMessage.options.contentType, 'application/json');
    assert.equal(publishedMessage.options.messageId, first.eventId);
    assert.equal(envelope.eventId, first.eventId);
    assert.equal(envelope.eventType, ORDER_EVENT_TYPES.CREATED);
    assert.deepEqual(envelope.data, {
      id: 101,
      clientId: 2,
      status: 'waiting',
      items: [{ productId: 1, qty: 1 }],
    });
    assert.ok(Number.isNaN(Date.parse(envelope.occurredAt)) === false);

    connections[0].emit('close');
    const second = await publisher.publish(ORDER_EVENT_TYPES.STATUS_CHANGED, {
      orderId: 101,
      clientId: 2,
      previousStatus: 'waiting',
      status: 'done',
    });

    assert.equal(connections.length, 2);
    assert.equal(connections[1].channels[0].messages.length, 1);
    assert.equal(second.eventType, ORDER_EVENT_TYPES.STATUS_CHANGED);
  } finally {
    await publisher.close();
  }

  assert.equal(connections[1].channels[0].closed, true);
  assert.equal(connections[1].closed, true);
});

test('publisher rejects unsupported event types and malformed payloads', async () => {
  const publisher = await createEventPublisher({
    amqpClient: {
      async connect() {
        return new FakeConnection();
      },
    },
  });
  const channel = publisher;

  try {
    await assert.rejects(
      channel.publish('user.deleted', { id: 1 }),
      /Tipo de evento não suportado/,
    );
    await assert.rejects(
      channel.publish(ORDER_EVENT_TYPES.CREATED, { id: 101 }),
      /Dados inválidos para o evento order\.created/,
    );
  } finally {
    await publisher.close();
  }
});

test('consumer acknowledges valid events and dead-letters malformed messages', async () => {
  const errors = [];
  const channel = new FakeChannel();
  const handler = createOrderEventHandler({
    channel,
    logger: { log() {}, error: (...args) => errors.push(args) },
  });
  const validMessage = {
    properties: { headers: {} },
    content: Buffer.from(JSON.stringify({
      eventId: 'event-1',
      eventType: ORDER_EVENT_TYPES.CREATED,
      occurredAt: new Date().toISOString(),
      data: { id: 101, clientId: 2, status: 'waiting', items: [{ productId: 1, qty: 1 }] },
    })),
  };
  const invalidMessage = { properties: { headers: {} }, content: Buffer.from('{invalid json') };

  await handler(validMessage);
  await handler(invalidMessage);

  assert.deepEqual(channel.acknowledgements, [validMessage]);
  assert.deepEqual(channel.rejections, [[invalidMessage, false, false]]);
  assert.equal(errors.length, 1);
});

test('consumer retries processing errors with exponential backoff and sends exhausted events to DLQ', async () => {
  const channel = new FakeChannel();
  const queueNames = createQueueNames('test.orders', 2, { baseDelayMs: 10 });
  const errors = [];
  const handler = createOrderEventHandler({
    channel,
    queueNames,
    maxRetries: 2,
    baseDelayMs: 10,
    processEvent: async () => {
      throw new Error('falha de processamento simulada');
    },
    logger: { log() {}, error: (...args) => errors.push(args) },
  });
  const makeMessage = (retryCount = 0) => ({
    content: Buffer.from(JSON.stringify({
      eventId: 'event-retry',
      eventType: ORDER_EVENT_TYPES.CREATED,
      occurredAt: new Date().toISOString(),
      data: { id: 101, clientId: 2, status: 'waiting', items: [{ productId: 1, qty: 1 }] },
    })),
    properties: { headers: { 'x-retry-count': retryCount } },
  });
  const firstAttempt = makeMessage();

  await handler(firstAttempt);
  const firstRetry = channel.messages[0];
  assert.equal(firstRetry.queue, queueNames.retries[0].name);
  assert.equal(firstRetry.options.headers['x-retry-count'], 1);
  assert.equal(firstRetry.options.headers['x-retry-delay-ms'], 10);
  assert.deepEqual(channel.acknowledgements, [firstAttempt]);

  await handler(makeMessage(1));
  const secondRetry = channel.messages[1];
  assert.equal(secondRetry.queue, queueNames.retries[1].name);
  assert.equal(secondRetry.options.headers['x-retry-count'], 2);
  assert.equal(secondRetry.options.headers['x-retry-delay-ms'], 20);

  const exhaustedAttempt = makeMessage(2);
  await handler(exhaustedAttempt);
  assert.deepEqual(channel.rejections, [[exhaustedAttempt, false, false]]);
  assert.equal(errors.length, 4);
});

test('retry policy limits the number of queues and caps exponential delays', () => {
  const queueNames = createQueueNames('bounded.events', MAX_RETRY_ATTEMPTS);
  assert.equal(queueNames.retries.length, MAX_RETRY_ATTEMPTS);
  assert.equal(queueNames.retries.at(-1).delayMs, 16_000);
  assert.throws(() => createQueueNames('bad prefix'), /caracteres inválidos/);
  assert.throws(() => createQueueNames('events', 21), /entre 0 e 20/);
});
