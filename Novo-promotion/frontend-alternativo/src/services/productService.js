import defaultStore from '../mocks/store.json';
import { mock, nextId } from './http';
import { daysUntil } from '../utils/date';
import { getProduto, getProdutos } from '../api.js';

let db = null;

export const findProduct = (id) => db?.find((p) => p.id === Number(id));
export const decrementStock = (id, qty) => {
  if (!db) return;
  db = db.map((p) => (p.id === Number(id) ? { ...p, stock: Math.max(0, p.stock - qty) } : p));
};

export const productService = {
  // GET /products?category=&search=&onlyAvailable=&sort=expiresAt|discount
  async list({ category, search, onlyAvailable, sort } = {}) {
    if (!db) db = await getProdutos();
    let r = db;
    if (category) r = r.filter((p) => p.category === category);
    if (search) {
      const s = search.trim().toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(s) || p.brand?.toLowerCase().includes(s));
    }
    if (onlyAvailable) r = r.filter((p) => p.stock > 0 && daysUntil(p.expiresAt) >= 0);
    if (sort === 'expiresAt') r = [...r].sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
    if (sort === 'discount') r = [...r].sort((a, b) => b.discount - a.discount);
    return r;
  },

  // GET /products/:id
  async get(id) {
    const p = findProduct(id);
    if (p) return p;
    const product = await getProduto(id);
    if (!product) throw new Error('Produto nao encontrado.');
    return product;
  },

  // POST /products
  create(data) {
    if (!db) db = [];
    const p = { store: defaultStore, images: [], ...data, id: nextId(db) };
    db = [...db, p];
    return mock(p);
  },

  // PUT /products/:id
  update(id, data) {
    if (!findProduct(id)) return mock(null, { fail: 'Produto não encontrado.' });
    db = db.map((p) => (p.id === Number(id) ? { ...p, ...data, id: p.id } : p));
    return mock(findProduct(id));
  },

  // DELETE /products/:id
  remove(id) {
    db = db.filter((p) => p.id !== Number(id));
    return mock({ success: true });
  },
};
