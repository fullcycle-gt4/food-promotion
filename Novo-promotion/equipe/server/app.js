import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';

const readSeed = (name) =>
  JSON.parse(
    readFileSync(
      fileURLToPath(new URL(`../frontend/src/mocks/${name}.json`, import.meta.url)),
      'utf8',
    ),
  );

const createState = () => ({
  categories: readSeed('categories'),
  orders: readSeed('orders'),
  products: readSeed('products'),
  users: readSeed('users'),
  sessions: new Map(),
});

const publicUser = ({ password, ...user }) => user;
const errorResponse = (res, status, code, message) =>
  res.status(status).json({ error: { code, message } });
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isPositiveId = (value) => /^\d+$/.test(value) && Number(value) > 0;
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const getUser = (state, id) => state.users.find((user) => user.id === Number(id));
const productFields = new Set([
  'name',
  'brand',
  'category',
  'description',
  'originalPrice',
  'promoPrice',
  'discount',
  'stock',
  'expiresAt',
  'batch',
  'images',
  'store',
]);

function requireAuth(state, roles = []) {
  return (req, res, next) => {
    const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    const userId = token && state.sessions.get(token);
    const user = userId && getUser(state, userId);

    if (!user) return errorResponse(res, 401, 'unauthorized', 'Autenticação necessária.');
    if (roles.length && !roles.includes(user.role))
      return errorResponse(res, 403, 'forbidden', 'Acesso não permitido.');

    req.user = user;
    next();
  };
}

function validateProduct(data, partial = false) {
  if (!isObject(data)) return 'O corpo da requisição deve ser um objeto JSON.';
  if (Object.keys(data).some((key) => !productFields.has(key)))
    return 'A requisição contém campos não permitidos.';

  const required = ['name', 'category', 'originalPrice', 'promoPrice', 'discount', 'stock', 'expiresAt'];
  if (!partial && required.some((key) => data[key] === undefined))
    return 'Informe nome, categoria, preços, desconto, estoque e vencimento.';
  if (partial && !Object.keys(data).length) return 'Informe ao menos um campo para atualizar.';
  if (data.name !== undefined && (typeof data.name !== 'string' || !data.name.trim()))
    return 'O nome do produto é obrigatório.';
  if (data.category !== undefined && (typeof data.category !== 'string' || !data.category.trim()))
    return 'A categoria do produto é obrigatória.';
  for (const key of ['originalPrice', 'promoPrice', 'discount', 'stock']) {
    if (data[key] !== undefined && (!isFiniteNumber(data[key]) || data[key] < 0))
      return `O campo ${key} deve ser um número não negativo.`;
  }
  if (data.stock !== undefined && !Number.isInteger(data.stock))
    return 'O estoque deve ser um número inteiro.';
  if (data.discount !== undefined && data.discount > 100)
    return 'O desconto deve estar entre 0 e 100.';
  if (
    data.expiresAt !== undefined &&
    (typeof data.expiresAt !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.expiresAt) ||
      Number.isNaN(Date.parse(`${data.expiresAt}T00:00:00Z`)) ||
      new Date(`${data.expiresAt}T00:00:00Z`).toISOString().slice(0, 10) !== data.expiresAt)
  )
    return 'O vencimento deve estar no formato YYYY-MM-DD.';
  if (
    data.originalPrice !== undefined &&
    data.promoPrice !== undefined &&
    data.promoPrice > data.originalPrice
  )
    return 'O preço promocional não pode ser maior que o preço original.';
  return null;
}

export function createApp({ publishEvent, now = () => new Date() }) {
  if (typeof publishEvent !== 'function')
    throw new TypeError('createApp exige uma função publishEvent para publicar eventos de pedidos.');

  const state = createState();
  const app = express();
  const api = express.Router();
  let orderMutationQueue = Promise.resolve();
  const serializeOrderMutation = async (mutation) => {
    const previousMutation = orderMutationQueue;
    let releaseMutation;
    orderMutationQueue = new Promise((resolve) => {
      releaseMutation = resolve;
    });
    await previousMutation;
    try {
      return await mutation();
    } finally {
      releaseMutation();
    }
  };

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  api.get('/health', (_req, res) => res.json({ status: 'ok' }));

  api.post('/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string')
      return errorResponse(res, 400, 'invalid_request', 'E-mail e senha são obrigatórios.');

    const user = state.users.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password,
    );
    if (!user) return errorResponse(res, 401, 'invalid_credentials', 'E-mail ou senha inválidos.');

    const token = randomBytes(32).toString('hex');
    state.sessions.set(token, user.id);
    return res.json({ ...publicUser(user), token });
  });

  api.post('/auth/register', (req, res) => {
    const data = req.body;
    if (
      !isObject(data) ||
      !['name', 'email', 'password'].every((key) => typeof data[key] === 'string' && data[key].trim())
    )
      return errorResponse(res, 400, 'invalid_request', 'Nome, e-mail e senha são obrigatórios.');
    if (Object.keys(data).some((key) => !['name', 'email', 'password', 'phone', 'cpf', 'city'].includes(key)))
      return errorResponse(res, 400, 'invalid_request', 'A requisição contém campos não permitidos.');
    if (state.users.some((user) => user.email.toLowerCase() === data.email.trim().toLowerCase()))
      return errorResponse(res, 409, 'email_exists', 'Este e-mail já está cadastrado.');

    const user = {
      ...data,
      id: Math.max(0, ...state.users.map((item) => item.id)) + 1,
      email: data.email.trim(),
      role: 'client',
    };
    state.users.push(user);
    const token = randomBytes(32).toString('hex');
    state.sessions.set(token, user.id);
    return res.status(201).json({ ...publicUser(user), token });
  });

  api.get('/categories', (_req, res) => res.json(state.categories));

  api.get('/products', (req, res) => {
    const { category, search, onlyAvailable, sort } = req.query;
    if (
      [category, search, onlyAvailable, sort].some(
        (value) => value !== undefined && typeof value !== 'string',
      )
    )
      return errorResponse(res, 400, 'invalid_query', 'Cada filtro deve ser informado uma única vez.');
    if (onlyAvailable !== undefined && !['true', 'false'].includes(onlyAvailable))
      return errorResponse(res, 400, 'invalid_query', 'onlyAvailable deve ser true ou false.');
    if (sort !== undefined && !['expiresAt', 'discount'].includes(sort))
      return errorResponse(res, 400, 'invalid_query', 'sort deve ser expiresAt ou discount.');

    let products = state.products;
    if (category) products = products.filter((product) => product.category === category);
    if (search) {
      const term = search.trim().toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) || product.brand?.toLowerCase().includes(term),
      );
    }
    if (onlyAvailable === 'true')
      products = products.filter(
        (product) =>
          product.stock > 0 && product.expiresAt >= new Date().toISOString().slice(0, 10),
      );
    if (sort === 'expiresAt')
      products = [...products].sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
    if (sort === 'discount') products = [...products].sort((a, b) => b.discount - a.discount);
    return res.json(products);
  });

  api.get('/products/:id', (req, res) => {
    if (!isPositiveId(req.params.id))
      return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
    const product = state.products.find((item) => item.id === Number(req.params.id));
    return product
      ? res.json(product)
      : errorResponse(res, 404, 'not_found', 'Produto não encontrado.');
  });

  api.post('/products', requireAuth(state, ['admin']), (req, res) => {
    const validationError = validateProduct(req.body);
    if (validationError) return errorResponse(res, 400, 'invalid_request', validationError);
    const product = {
      store: readSeed('store'),
      images: [],
      ...req.body,
      id: Math.max(0, ...state.products.map((item) => item.id)) + 1,
    };
    state.products.push(product);
    return res.status(201).json(product);
  });

  api.put('/products/:id', requireAuth(state, ['admin']), (req, res) => {
    if (!isPositiveId(req.params.id))
      return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
    const product = state.products.find((item) => item.id === Number(req.params.id));
    if (!product) return errorResponse(res, 404, 'not_found', 'Produto não encontrado.');
    const validationError = validateProduct(req.body, true);
    if (validationError) return errorResponse(res, 400, 'invalid_request', validationError);
    const mergedProduct = Object.fromEntries(
      Object.entries({ ...product, ...req.body }).filter(([key]) => productFields.has(key)),
    );
    const mergedValidationError = validateProduct(mergedProduct);
    if (mergedValidationError)
      return errorResponse(res, 400, 'invalid_request', mergedValidationError);
    Object.assign(product, req.body);
    return res.json(product);
  });

  api.delete('/products/:id', requireAuth(state, ['admin']), (req, res) => {
    if (!isPositiveId(req.params.id))
      return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
    const index = state.products.findIndex((item) => item.id === Number(req.params.id));
    if (index < 0) return errorResponse(res, 404, 'not_found', 'Produto não encontrado.');
    state.products.splice(index, 1);
    return res.status(204).end();
  });

  api.put('/users/:id', requireAuth(state), (req, res) => {
    if (!isPositiveId(req.params.id))
      return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
    if (req.user.role !== 'admin' && req.user.id !== Number(req.params.id))
      return errorResponse(res, 403, 'forbidden', 'Só é possível atualizar o próprio perfil.');
    const user = getUser(state, req.params.id);
    if (!user) return errorResponse(res, 404, 'not_found', 'Usuário não encontrado.');
    if (!isObject(req.body) || !Object.keys(req.body).length)
      return errorResponse(res, 400, 'invalid_request', 'Informe ao menos um campo para atualizar.');

    const allowed = ['name', 'email', 'phone', 'cpf', 'city'];
    if (Object.keys(req.body).some((key) => !allowed.includes(key)))
      return errorResponse(res, 400, 'invalid_request', 'A requisição contém campos não permitidos.');
    if (Object.values(req.body).some((value) => typeof value !== 'string'))
      return errorResponse(res, 400, 'invalid_request', 'Os campos de perfil devem ser texto.');
    if (
      req.body.email &&
      state.users.some(
        (candidate) =>
          candidate.id !== user.id &&
          candidate.email.toLowerCase() === req.body.email.trim().toLowerCase(),
      )
    )
      return errorResponse(res, 409, 'email_exists', 'Este e-mail já está cadastrado.');
    if (req.body.email) req.body.email = req.body.email.trim();
    Object.assign(user, req.body, { id: user.id, role: user.role });
    return res.json(publicUser(user));
  });

  api.put('/users/:id/password', requireAuth(state), (req, res) => {
    if (!isPositiveId(req.params.id))
      return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
    if (req.user.role !== 'admin' && req.user.id !== Number(req.params.id))
      return errorResponse(res, 403, 'forbidden', 'Só é possível alterar a própria senha.');
    const user = getUser(state, req.params.id);
    if (!user) return errorResponse(res, 404, 'not_found', 'Usuário não encontrado.');
    const { currentPassword, newPassword } = req.body ?? {};
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || !newPassword)
      return errorResponse(res, 400, 'invalid_request', 'Informe a senha atual e a nova senha.');
    if (user.password !== currentPassword)
      return errorResponse(res, 400, 'invalid_password', 'Senha atual incorreta.');
    user.password = newPassword;
    return res.status(204).end();
  });

  api.delete('/users/:id', requireAuth(state), (req, res) => {
    if (!isPositiveId(req.params.id))
      return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
    if (req.user.role !== 'admin' && req.user.id !== Number(req.params.id))
      return errorResponse(res, 403, 'forbidden', 'Só é possível remover a própria conta.');
    const index = state.users.findIndex((user) => user.id === Number(req.params.id));
    if (index < 0) return errorResponse(res, 404, 'not_found', 'Usuário não encontrado.');
    state.users.splice(index, 1);
    for (const [token, userId] of state.sessions) {
      if (userId === Number(req.params.id)) state.sessions.delete(token);
    }
    return res.status(204).end();
  });

  api.get('/orders', requireAuth(state), (req, res) => {
    const { status, clientId } = req.query;
    if (
      (status !== undefined && typeof status !== 'string') ||
      (clientId !== undefined && typeof clientId !== 'string')
    )
      return errorResponse(res, 400, 'invalid_query', 'Cada filtro deve ser informado uma única vez.');
    if (status !== undefined && !['waiting', 'done', 'canceled'].includes(status))
      return errorResponse(res, 400, 'invalid_query', 'Status do pedido inválido.');
    let orders = state.orders;
    if (req.user.role !== 'admin') orders = orders.filter((order) => order.clientId === req.user.id);
    if (status) orders = orders.filter((order) => order.status === status);
    if (clientId) {
      if (!isPositiveId(clientId))
        return errorResponse(res, 400, 'invalid_query', 'clientId deve ser um número positivo.');
      if (req.user.role !== 'admin' && Number(clientId) !== req.user.id)
        return errorResponse(res, 403, 'forbidden', 'Acesso não permitido.');
      orders = orders.filter((order) => order.clientId === Number(clientId));
    }
    return res.json(
      [...orders]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((order) => ({
          ...order,
          total: order.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
          itemsCount: order.items.reduce((sum, item) => sum + item.qty, 0),
        })),
    );
  });

  api.get('/orders/:id', requireAuth(state), (req, res) => {
    if (!isPositiveId(req.params.id))
      return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
    const order = state.orders.find((item) => item.id === Number(req.params.id));
    if (!order) return errorResponse(res, 404, 'not_found', 'Pedido não encontrado.');
    if (req.user.role !== 'admin' && order.clientId !== req.user.id)
      return errorResponse(res, 403, 'forbidden', 'Acesso não permitido.');
    return res.json({
      ...order,
      total: order.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
      itemsCount: order.items.reduce((sum, item) => sum + item.qty, 0),
    });
  });

  api.post('/orders', requireAuth(state, ['client']), (req, res) =>
    serializeOrderMutation(async () => {
      const { items, delivery, payment, notes } = req.body ?? {};
      if (
        !Array.isArray(items) ||
        !items.length ||
        items.some(
          (item) =>
            !isObject(item) ||
            !Number.isInteger(item.productId) ||
            !Number.isInteger(item.qty) ||
            item.qty < 1,
        )
      )
        return errorResponse(
          res,
          400,
          'invalid_request',
          'Informe ao menos um item com produto e quantidade válidos.',
        );
      if (!['pickup', 'home'].includes(delivery) || !['pix', 'credit', 'debit'].includes(payment))
        return errorResponse(res, 400, 'invalid_request', 'Forma de entrega ou pagamento inválida.');

      const quantities = new Map();
      for (const item of items)
        quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.qty);

      const createdAt = now();
      const currentDate = createdAt.toISOString().slice(0, 10);
      const lines = [];
      for (const [productId, qty] of quantities) {
        const product = state.products.find((candidate) => candidate.id === productId);
        if (!product || product.stock < qty || product.expiresAt < currentDate)
          return errorResponse(
            res,
            409,
            'unavailable_product',
            'Produto indisponível ou estoque insuficiente.',
          );
        lines.push({
          productId: product.id,
          name: product.name,
          expiresAt: product.expiresAt,
          qty,
          unitPrice: product.promoPrice,
          originalPrice: product.originalPrice,
        });
      }

      const pickupLimit = new Date(createdAt);
      pickupLimit.setDate(pickupLimit.getDate() + 2);
      const earliestExpiry = lines.map((item) => item.expiresAt).sort()[0];
      const pickupLimitIso = pickupLimit.toISOString().slice(0, 10);
      const order = {
        id: Math.max(0, ...state.orders.map((item) => item.id)) + 1,
        clientId: req.user.id,
        clientName: req.user.name,
        clientPhone: req.user.phone ?? '',
        status: 'waiting',
        payment,
        delivery,
        notes: typeof notes === 'string' ? notes : '',
        pickupUntil: earliestExpiry < pickupLimitIso ? earliestExpiry : pickupLimitIso,
        createdAt: createdAt.toISOString(),
        items: lines,
      };
      try {
        await publishEvent('order.created', order);
      } catch (error) {
        console.error('Falha ao publicar o evento order.created.', error);
        return errorResponse(
          res,
          503,
          'messaging_unavailable',
          'Não foi possível processar o pedido. Tente novamente.',
        );
      }
      for (const line of lines)
        state.products.find((product) => product.id === line.productId).stock -= line.qty;
      state.orders.unshift(order);
      return res.status(201).json({
        ...order,
        total: lines.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
        itemsCount: lines.reduce((sum, item) => sum + item.qty, 0),
      });
    }),
  );

  api.patch('/orders/:id/status', requireAuth(state, ['admin']), (req, res) =>
    serializeOrderMutation(async () => {
      if (!isPositiveId(req.params.id))
        return errorResponse(res, 400, 'invalid_id', 'O identificador deve ser um número positivo.');
      const order = state.orders.find((item) => item.id === Number(req.params.id));
      if (!order) return errorResponse(res, 404, 'not_found', 'Pedido não encontrado.');
      if (!['waiting', 'done', 'canceled'].includes(req.body?.status))
        return errorResponse(res, 400, 'invalid_request', 'Status do pedido inválido.');
      try {
        await publishEvent('order.status_changed', {
          orderId: order.id,
          clientId: order.clientId,
          previousStatus: order.status,
          status: req.body.status,
        });
      } catch (error) {
        console.error('Falha ao publicar o evento order.status_changed.', error);
        return errorResponse(
          res,
          503,
          'messaging_unavailable',
          'Não foi possível atualizar o pedido. Tente novamente.',
        );
      }
      order.status = req.body.status;
      return res.json(order);
    }),
  );

  app.use('/api', api);
  app.use((_req, res) => errorResponse(res, 404, 'not_found', 'Rota não encontrada.'));
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed')
      return errorResponse(res, 400, 'invalid_json', 'O corpo da requisição contém JSON inválido.');
    console.error(error);
    return errorResponse(res, 500, 'internal_error', 'Erro interno do servidor.');
  });

  return app;
}
