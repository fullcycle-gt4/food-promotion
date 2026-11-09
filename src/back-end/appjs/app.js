const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Rota da Documentação Viva
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API (Prefixo global de versão)
app.use('/api/v1', userRoutes);

// Middleware Global de Erro 500 (RFC 7807)
app.use((err, req, res, next) => {
  console.err(err.stack);
  res.status(500).json({
    type: "https://api.empresa.com/errors/internal-server-error",
    title: "Erro Interno no Servidor",
    status: 500,
    detail: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    instance: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger disponível em http://localhost:${PORT}/docs`);
});