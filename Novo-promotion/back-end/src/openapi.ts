const sucessoSchema = {
  type: 'object',
  required: ['data', 'meta'],
  properties: {
    data: {},
    meta: {
      type: 'object',
      required: ['requestId'],
      properties: {
        requestId: { type: 'string', format: 'uuid' },
        pagination: {
          type: 'object',
          required: ['page', 'pageSize', 'total', 'totalPages'],
          properties: {
            page: { type: 'integer', minimum: 1 },
            pageSize: { type: 'integer', minimum: 1, maximum: 100 },
            total: { type: 'integer', minimum: 0 },
            totalPages: { type: 'integer', minimum: 0 },
          },
        },
      },
    },
  },
}

const erroSchema = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message', 'requestId'],
      properties: {
        code: { type: 'string', example: 'VALIDATION_ERROR' },
        message: { type: 'string' },
        requestId: { type: 'string', format: 'uuid' },
        details: {
          type: 'array',
          items: {
            type: 'object',
            required: ['field', 'message'],
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

const respostaErro = (description) => ({
  description,
  headers: { 'X-Request-Id': { $ref: '#/components/headers/RequestId' } },
  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
})

const respostaSucesso = (description, dataSchema) => ({
  description,
  headers: { 'X-Request-Id': { $ref: '#/components/headers/RequestId' } },
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/SuccessResponse' },
          {
            type: 'object',
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    },
  },
})

const produtoSchema = {
  type: 'object',
  required: ['id', 'name', 'originalPrice', 'promoPrice', 'discount', 'stock', 'expiresAt'],
  properties: {
    id: { type: 'integer', example: 7 },
    name: { type: 'string', example: 'Suco de Uva Integral 1L' },
    brand: { type: 'string', example: 'Serra Alta' },
    category: { type: 'string', example: 'Bebidas' },
    description: { type: 'string' },
    originalPrice: { type: 'number', format: 'float', example: 14.9 },
    promoPrice: { type: 'number', format: 'float', example: 8.9 },
    discount: { type: 'integer', minimum: 0, maximum: 100, example: 40 },
    stock: { type: 'integer', minimum: 0, example: 22 },
    expiresAt: { type: 'string', format: 'date', example: '2026-10-06' },
    batch: { type: 'string' },
    images: { type: 'array', items: { type: 'string', format: 'uri' } },
    store: { type: 'object', additionalProperties: true },
  },
}

const categoriaSchema = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Bebidas' },
  },
}

const requestIdHeader = {
  description: 'Identificador único para rastrear esta requisição.',
  schema: { type: 'string', format: 'uuid' },
}

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Food Promotion API',
    version: '1.0.0',
    description: [
      'API REST versionada para consulta do catálogo Food Promotion.',
      '',
      'Respostas de sucesso usam `{ data, meta }`; erros usam `{ error: { code, message, details?, requestId } }`.',
      'A coleção de produtos suporta paginação por `page` e `pageSize` (máximo 100).',
      'As rotas de escrita, autenticação, usuários e pedidos serão publicadas em etapas futuras, após definição de persistência e segurança.',
    ].join('\n'),
  },
  servers: [{ url: '/api/v1', description: 'Versão atual da API' }],
  tags: [
    { name: 'Health', description: 'Disponibilidade do serviço' },
    { name: 'Catalog', description: 'Consulta pública de categorias e produtos' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica a disponibilidade da API',
        operationId: 'getHealth',
        responses: {
          200: respostaSucesso('Serviço disponível.', {
            type: 'object',
            required: ['status', 'service', 'version'],
            properties: {
              status: { type: 'string', enum: ['ok'] },
              service: { type: 'string', example: 'food-promotion-api' },
              version: { type: 'string', example: 'v1' },
            },
          }),
          500: respostaErro('Erro interno do servidor.'),
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Catalog'],
        summary: 'Lista as categorias de produtos',
        operationId: 'listCategories',
        responses: {
          200: respostaSucesso('Categorias retornadas.', { type: 'array', items: categoriaSchema }),
          500: respostaErro('Erro interno do servidor.'),
        },
      },
    },
    '/products': {
      get: {
        tags: ['Catalog'],
        summary: 'Lista e filtra produtos disponíveis',
        operationId: 'listProducts',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string', maxLength: 100 } },
          { name: 'search', in: 'query', schema: { type: 'string', maxLength: 100 } },
          {
            name: 'onlyAvailable',
            in: 'query',
            description: 'Filtra produtos sem estoque. Produtos vencidos são sempre omitidos.',
            schema: { type: 'boolean', default: true },
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['expiresAt', 'discount'], default: 'expiresAt' },
          },
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
        ],
        responses: {
          200: respostaSucesso('Página de produtos retornada.', { type: 'array', items: produtoSchema }),
          400: respostaErro('Parâmetro de consulta inválido.'),
          500: respostaErro('Erro interno do servidor.'),
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Catalog'],
        summary: 'Consulta um produto pelo identificador',
        operationId: 'getProductById',
        parameters: [{
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
        }],
        responses: {
          200: respostaSucesso('Produto retornado.', produtoSchema),
          400: respostaErro('Identificador inválido.'),
          404: respostaErro('Produto não encontrado ou indisponível.'),
          500: respostaErro('Erro interno do servidor.'),
        },
      },
    },
  },
  components: {
    schemas: {
      SuccessResponse: sucessoSchema,
      ErrorResponse: erroSchema,
      Product: produtoSchema,
      Category: categoriaSchema,
    },
    headers: {
      RequestId: requestIdHeader,
    },
  },
}

export default openApiSpec
