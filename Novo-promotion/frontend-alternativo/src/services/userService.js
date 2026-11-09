import seed from '../mocks/users.json';
import { mock, nextId } from './http';

const STORAGE_KEY = 'fp:users';

function readUsers() {
  if (typeof window === 'undefined') return structuredClone(seed);
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seed);
  try {
    const users = JSON.parse(saved);
    if (!Array.isArray(users)) throw new Error('O conteúdo salvo não é uma lista.');
    return users;
  } catch (error) {
    throw new Error(`Não foi possível ler os usuários salvos: ${error.message}`);
  }
}

let db = readUsers();

const publicUser = ({ password, ...u }) => u;
const byId = (id) => db.find((u) => u.id === Number(id));

function saveUsers(users) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  db = users;
}

function duplicateEmail(email, exceptId) {
  const normalized = email.trim().toLowerCase();
  return db.some((u) => u.id !== exceptId && u.email.toLowerCase() === normalized);
}

export const authService = {
  // POST /auth/login  body: { email, password }
  login(email, password) {
    const u = db.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    return u ? mock({ ...publicUser(u), token: `mock-token-${u.id}` }) : mock(null, { fail: 'E-mail ou senha inválidos.' });
  },

  // POST /auth/register  body: { name, email, phone, cpf, city, password }
  register(data) {
    if (duplicateEmail(data.email))
      return mock(null, { fail: 'Este e-mail já está cadastrado.' });
    const u = { ...data, email: data.email.trim(), id: nextId(db), role: 'client' };
    saveUsers([...db, u]);
    return mock({ ...publicUser(u), token: `mock-token-${u.id}` });
  },
};

export const userService = {
  // GET /users
  list() {
    return mock(db.map(publicUser));
  },

  // POST /users/admin
  createAdmin(data) {
    const email = data.email?.trim() || '';
    if (!data.name?.trim()) return mock(null, { fail: 'Informe o nome do administrador.' });
    if (!email) return mock(null, { fail: 'Informe o e-mail do administrador.' });
    if (duplicateEmail(email)) return mock(null, { fail: 'Este e-mail já está cadastrado.' });
    if ((data.password || '').length < 8) return mock(null, { fail: 'A senha deve ter no mínimo 8 caracteres.' });
    const user = {
      id: nextId(db),
      role: 'admin',
      name: data.name.trim(),
      email,
      phone: data.phone?.trim() || '',
      password: data.password,
    };
    saveUsers([...db, user]);
    return mock(publicUser(user));
  },

  // PATCH /users/:id/role
  updateRole(id, role, actorId) {
    const user = byId(id);
    if (!user) return mock(null, { fail: 'Usuário não encontrado.' });
    if (role !== 'admin' && role !== 'client') return mock(null, { fail: 'Perfil inválido.' });
    if (user.id === Number(actorId)) return mock(null, { fail: 'Não é possível alterar o próprio perfil.' });
    if (user.role === 'admin' && role !== 'admin' && db.filter((u) => u.role === 'admin').length === 1)
      return mock(null, { fail: 'O sistema precisa manter pelo menos um administrador.' });
    const users = db.map((u) => (u.id === user.id ? { ...u, role } : u));
    saveUsers(users);
    return mock(publicUser(byId(id)));
  },

  // PUT /users/:id
  updateProfile(id, data) {
    const user = byId(id);
    if (!user) return mock(null, { fail: 'Usuário não encontrado.' });
    if (data.email && duplicateEmail(data.email, user.id))
      return mock(null, { fail: 'Este e-mail já está cadastrado.' });
    const users = db.map((u) => (u.id === user.id ? { ...u, ...data, id: u.id, role: u.role } : u));
    saveUsers(users);
    return mock(publicUser(byId(id)));
  },

  // PUT /users/:id/password  body: { currentPassword, newPassword }
  changePassword(id, currentPassword, newPassword) {
    const u = byId(id);
    if (!u) return mock(null, { fail: 'Usuário não encontrado.' });
    if (u.password !== currentPassword) return mock(null, { fail: 'Senha atual incorreta.' });
    saveUsers(db.map((x) => (x.id === u.id ? { ...x, password: newPassword } : x)));
    return mock({ success: true });
  },

  // DELETE /users/:id
  remove(id) {
    const user = byId(id);
    if (!user) return mock(null, { fail: 'Usuário não encontrado.' });
    if (user.role === 'admin' && db.filter((u) => u.role === 'admin').length === 1)
      return mock(null, { fail: 'O sistema precisa manter pelo menos um administrador.' });
    saveUsers(db.filter((u) => u.id !== Number(id)));
    return mock({ success: true });
  },
};
