import seed from '../mocks/users.json';
import { mock, nextId } from './http';

let db = structuredClone(seed);

// eslint-disable-next-line no-unused-vars
const publicUser = ({ password, ...u }) => u;
const byId = (id) => db.find((u) => u.id === Number(id));

export const authService = {
  // POST /auth/login  body: { email, password }
  login(email, password) {
    const u = db.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    return u ? mock({ ...publicUser(u), token: `mock-token-${u.id}` }) : mock(null, { fail: 'E-mail ou senha inválidos.' });
  },

  // POST /auth/register  body: { name, email, phone, cpf, city, password }
  register(data) {
    if (db.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase()))
      return mock(null, { fail: 'Este e-mail já está cadastrado.' });
    const u = { ...data, email: data.email.trim(), id: nextId(db), role: 'client' };
    db = [...db, u];
    return mock({ ...publicUser(u), token: `mock-token-${u.id}` });
  },
};

export const userService = {
  // PUT /users/:id
  updateProfile(id, data) {
    if (!byId(id)) return mock(null, { fail: 'Usuário não encontrado.' });
    db = db.map((u) => (u.id === Number(id) ? { ...u, ...data, id: u.id, role: u.role } : u));
    return mock(publicUser(byId(id)));
  },

  // PUT /users/:id/password  body: { currentPassword, newPassword }
  changePassword(id, currentPassword, newPassword) {
    const u = byId(id);
    if (!u) return mock(null, { fail: 'Usuário não encontrado.' });
    if (u.password !== currentPassword) return mock(null, { fail: 'Senha atual incorreta.' });
    db = db.map((x) => (x.id === u.id ? { ...x, password: newPassword } : x));
    return mock({ success: true });
  },

  // DELETE /users/:id
  remove(id) {
    db = db.filter((u) => u.id !== Number(id));
    return mock({ success: true });
  },
};
