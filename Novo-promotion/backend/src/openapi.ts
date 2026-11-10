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

const usuarioSchema = {
  type: 'object',
  required: ['id', 'email'],
  properties: {
    id: { type: 'integer', example: 1 },
    email: { type: 'string', format: 'email' },
    name: { type: ['string', 'null'] },
    posts: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
  },
}

const publicacaoSchema = {
  type: 'object',
  required: ['id', 'title', 'published', 'authorId'],
  properties: {
    id: { type: 'integer', example: 1 },
    title: { type: 'string' },
    content: { type: ['string', 'null'] },
    published: { type: 'boolean' },
    authorId: { type: 'integer' },
    author: { $ref: '#/components/schemas/User' },
  },
}

const respostaCrudErro = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['error'],
        properties: { error: { type: 'string' } },
      },
    },
  },
})

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Food Promotion API',
    version: '1.0.0',
    description: [
      'API REST do Food Promotion para consulta do catálogo e gerenciamento de usuários e publicações.',
      '',
      'O catálogo usa envelopes `{ data, meta }` e `{ error: { code, message, details?, requestId } }`. As rotas CRUD legadas de usuários e publicações mantêm seus contratos diretos.',
      'A coleção de produtos suporta paginação por `page` e `pageSize` (máximo 100).',
      'As rotas do catálogo usam o prefixo /api/v1. As rotas CRUD de usuários e publicações usam /users e /posts e são mantidas para integração com o sistema da equipe.',
    ].join('\n'),
  },
  servers: [{ url: '/', description: 'API Food Promotion' }],
  tags: [
    { name: 'Health', description: 'Disponibilidade do serviço' },
    { name: 'Catalog', description: 'Consulta pública de categorias e produtos' },
    { name: 'Users', description: 'Gerenciamento de usuários' },
    { name: 'Posts', description: 'Gerenciamento de publicações' },
  ],
  paths: {
    '/api/v1/health': {
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
    '/api/v1/categories': {
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
    '/api/v1/products': {
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
    '/api/v1/products/{id}': {
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
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Lista usuários e suas publicações',
        operationId: 'listUsers',
        responses: {
          200: {
            description: 'Usuários retornados.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Cria um usuário',
        operationId: 'createUser',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  name: { type: ['string', 'null'] },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário criado.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          400: respostaCrudErro('Dados inválidos.'),
          409: respostaCrudErro('E-mail já cadastrado.'),
        },
      },
    },
    '/users/{id}': {
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      }],
      get: {
        tags: ['Users'],
        summary: 'Consulta um usuário',
        operationId: 'getUserById',
        responses: {
          200: {
            description: 'Usuário retornado.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          404: respostaCrudErro('Usuário não encontrado.'),
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Atualiza um usuário',
        operationId: 'updateUser',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  email: { type: 'string', format: 'email' },
                  name: { type: ['string', 'null'] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Usuário atualizado.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          400: respostaCrudErro('Dados inválidos.'),
          404: respostaCrudErro('Usuário não encontrado.'),
          409: respostaCrudErro('E-mail já cadastrado.'),
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Remove um usuário',
        operationId: 'deleteUser',
        responses: {
          204: { description: 'Usuário removido.' },
          404: respostaCrudErro('Usuário não encontrado.'),
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Lista publicações e seus autores',
        operationId: 'listPosts',
        responses: {
          200: {
            description: 'Publicações retornadas.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } },
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Cria uma publicação',
        operationId: 'createPost',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'authorId'],
                properties: {
                  title: { type: 'string' },
                  content: { type: ['string', 'null'] },
                  authorId: { type: 'integer', minimum: 1 },
                  published: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Publicação criada.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
          },
          400: respostaCrudErro('Dados inválidos.'),
          409: respostaCrudErro('Autor inválido.'),
        },
      },
    },
    '/posts/{id}': {
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      }],
      get: {
        tags: ['Posts'],
        summary: 'Consulta uma publicação',
        operationId: 'getPostById',
        responses: {
          200: {
            description: 'Publicação retornada.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
          },
          404: respostaCrudErro('Publicação não encontrada.'),
        },
      },
      put: {
        tags: ['Posts'],
        summary: 'Atualiza uma publicação',
        operationId: 'updatePost',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  title: { type: 'string' },
                  content: { type: ['string', 'null'] },
                  authorId: { type: 'integer', minimum: 1 },
                  published: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Publicação atualizada.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
          },
          400: respostaCrudErro('Dados inválidos.'),
          404: respostaCrudErro('Publicação não encontrada.'),
          409: respostaCrudErro('Autor inválido.'),
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Remove uma publicação',
        operationId: 'deletePost',
        responses: {
          204: { description: 'Publicação removida.' },
          404: respostaCrudErro('Publicação não encontrada.'),
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
      User: usuarioSchema,
      Post: publicacaoSchema,
    },
    headers: {
      RequestId: requestIdHeader,
    },
  },
}

export default openApiSpec
