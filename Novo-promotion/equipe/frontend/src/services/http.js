// Camada de transporte.
// Hoje todas as respostas vêm dos mocks em src/mocks. Quando a API existir,
// substitua `mock(...)` nos services por chamadas a `request(...)`.

export const API_URL = import.meta.env.VITE_API_URL || '/api';
const DELAY = Number(import.meta.env.VITE_MOCK_DELAY ?? 300);

export function mock(data, { fail } = {}) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error(fail)) : resolve(data === undefined ? data : structuredClone(data))), DELAY),
  );
}

export async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Erro na requisição');
  return data;
}

export const nextId = (list) => Math.max(0, ...list.map((i) => i.id)) + 1;
