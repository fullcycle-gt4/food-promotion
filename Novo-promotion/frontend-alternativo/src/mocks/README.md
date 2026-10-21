# Mocks — contrato da API

Cada arquivo representa a resposta de um recurso. Use-os como exemplo de payload na documentação (Swagger/OpenAPI).

| Arquivo            | Endpoints                                                                 |
|--------------------|---------------------------------------------------------------------------|
| `users.json`       | `POST /auth/login`, `POST /auth/register`, `PUT /users/:id`, `PUT /users/:id/password`, `DELETE /users/:id` |
| `categories.json`  | `GET /categories`                                                         |
| `products.json`    | `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id` |
| `orders.json`      | `GET /orders`, `GET /orders/:id`, `POST /orders`, `PATCH /orders/:id/status` |
| `store.json`       | Loja padrão vinculada aos produtos                                        |
| `enums.json`       | Valores aceitos para status do pedido, pagamento e entrega                |

## users.json
| Campo    | Tipo   | Obs.                          |
|----------|--------|-------------------------------|
| id       | number |                               |
| role     | string | `admin` \| `client`           |
| name     | string |                               |
| email    | string | único                         |
| phone    | string | `(85) 98888-7777`             |
| cpf      | string | apenas clientes               |
| city     | string | apenas clientes               |
| password | string | nunca retornar na API real    |

`POST /auth/login` → body `{ email, password }` → resposta: usuário sem `password` + `token`.

## products.json
| Campo         | Tipo     | Obs.                                  |
|---------------|----------|---------------------------------------|
| id            | number   |                                       |
| name          | string   |                                       |
| brand         | string   |                                       |
| category      | string   | nome de `categories.json`             |
| description   | string   |                                       |
| originalPrice | number   | R$                                    |
| promoPrice    | number   | R$                                    |
| discount      | number   | % (0–100)                             |
| stock         | number   | unidades                              |
| expiresAt     | string   | `YYYY-MM-DD`                          |
| batch         | string   | lote                                  |
| images        | string[] | URLs                                  |
| store         | object   | `{ name, city }`                      |

`GET /products` aceita `category`, `search`, `onlyAvailable` (estoque > 0 e não vencido) e `sort` (`expiresAt` \| `discount`).

## orders.json
| Campo       | Tipo   | Obs.                                         |
|-------------|--------|----------------------------------------------|
| id          | number |                                              |
| clientId    | number |                                              |
| clientName  | string |                                              |
| clientPhone | string |                                              |
| status      | string | `waiting` \| `done` \| `canceled`            |
| payment     | string | `pix` \| `credit` \| `debit`                 |
| delivery    | string | `pickup` \| `home`                           |
| notes       | string |                                              |
| pickupUntil | string | `YYYY-MM-DD`                                 |
| createdAt   | string | ISO 8601                                     |
| items       | array  | `{ productId, name, expiresAt, qty, unitPrice, originalPrice }` |

`POST /orders` → body `{ items: [{ productId, qty }], delivery, payment, notes }` (cliente vem do token).
`PATCH /orders/:id/status` → body `{ status }`.
