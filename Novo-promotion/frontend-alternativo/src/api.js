const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getPromocoes() {
  const response = await `${API_URL}/promocoes`;
  return response.json();
}

import express from 'express';
import cors from 'cors';

const app = express();

// 1. Ativa o CORS permitindo requisições do seu frontend local e do Render
app.use(cors({
  origin: [
    'http://localhost:5173',                  // Porta padrão do Vite local
    'https://seu-frontend.onrender.com'       // Substitua pela URL real do seu frontend no Render
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP liberados
  credentials: true                           // Permite envio de cookies/tokens de autenticação, se usar
}));

// Se quiser liberar para *qualquer* site acessar (útil para testes rápidos):
// app.use(cors());

app.use(express.json());

// Suas rotas aqui...
// app.use('/promocoes', rotasPromocoes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});