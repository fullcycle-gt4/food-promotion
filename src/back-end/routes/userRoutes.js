const express = require('express');
const { z } = require('zod');
const router = express.Router();

// Schema de Validação com Zod
const createUserSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail com formato inválido")
});

/**
 * @openapi
 * /api/v1/user-profiles:
 *   post:
 *   ... (configuração OpenAPI abaixo)
 */
router.post('/user-profiles', (req, res, next) => {
  try {
    // Validação do Payload
    const validationResult = createUserSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      // Erro estruturado (RFC 7807 adaptado)
      return res.status(400).json({
        type: "https://api.empresa.com/errors/validation-error",
        title: "Erro de Validação nos Dados",
        status: 400,
        detail: "Um ou mais campos preenchidos são inválidos.",
        instance: req.originalUrl,
        timestamp: new Date().toISOString(),
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const newUser = { id: "uuid-123-abc", ...validationResult.data };

    // Envelope Padrão de Sucesso (201 Created)
    return res.status(201).json({
      success: true,
      data: newUser,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

// Exemplo de Listagem com Paginação, Ordenação e Filtros
router.get('/user-profiles', (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt', filter = {} } = req.query;

  // Lógica de mock de listagem
  return res.status(200).json({
    success: true,
    meta: {
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: 50,
        totalPages: 5
      },
      sort,
      filter
    },
    data: [
      { id: "uuid-1", name: "Ana Souza", email: "ana@email.com" }
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;