
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  return response.json();
}

// Consulta produtos
export async function getProdutos() {
  const payload = await request('/api/v1/products');
  return payload?.data ?? [];
}

// Consulta produto por id
export async function getProduto(id) {
  const payload = await request(`/api/v1/products/${encodeURIComponent(id)}`);
  return payload?.data ?? null;
}

// Consulta categorias
export async function getCategorias() {
  const payload = await request('/api/v1/categories');
  return payload?.data ?? [];
}
