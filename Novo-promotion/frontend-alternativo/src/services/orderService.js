import seed from '../mocks/orders.json';
import { mock, nextId } from './http';
import { findProduct, decrementStock } from './productService';
import { toISODate } from '../utils/date';

let db = structuredClone(seed);

const enrich = (o) => ({
  ...o,
  total: o.items.reduce((a, i) => a + i.qty * i.unitPrice, 0),
  itemsCount: o.items.reduce((a, i) => a + i.qty, 0),
});

export const orderService = {
  // GET /orders?status=&clientId=
  list({ status, clientId } = {}) {
    let r = db;
    if (status) r = r.filter((o) => o.status === status);
    if (clientId) r = r.filter((o) => o.clientId === Number(clientId));
    r = [...r].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return mock(r.map(enrich));
  },

  // GET /orders/:id
  get(id) {
    const o = db.find((o) => o.id === Number(id));
    return o ? mock(enrich(o)) : mock(null, { fail: 'Pedido não encontrado.' });
  },

  // POST /orders  body: { items: [{ productId, qty }], delivery, payment, notes }
  create({ client, items, delivery, payment, notes }) {
    if (!items?.length) return mock(null, { fail: 'Carrinho vazio.' });
    const lines = items.map(({ productId, qty }) => {
      const p = findProduct(productId);
      if (!p) throw new Error('Produto indisponível.');
      return { productId: p.id, name: p.name, expiresAt: p.expiresAt, qty, unitPrice: p.promoPrice, originalPrice: p.originalPrice };
    });
    const limit = new Date();
    limit.setDate(limit.getDate() + 2);
    const earliest = lines.map((l) => l.expiresAt).sort()[0];
    const limitIso = toISODate(limit);
    const order = {
      id: nextId(db),
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      status: 'waiting',
      payment,
      delivery,
      notes: notes || '',
      pickupUntil: earliest < limitIso ? earliest : limitIso,
      createdAt: new Date().toISOString(),
      items: lines,
    };
    db = [order, ...db];
    lines.forEach((l) => decrementStock(l.productId, l.qty));
    return mock(enrich(order));
  },

  // PATCH /orders/:id/status  body: { status }
  updateStatus(id, status) {
    db = db.map((o) => (o.id === Number(id) ? { ...o, status } : o));
    return this.get(id);
  },
};
