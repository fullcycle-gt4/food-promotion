# HTTP API

A API local usa o prefixo `/api`, escuta na porta `3000` por padrão e mantém os dados em memória. Os dados iniciais vêm dos arquivos em `frontend/src/mocks`; alterações são descartadas quando o processo reinicia.

## Autenticação

As rotas marcadas como protegidas exigem `Authorization: Bearer <token>`. Obtenha o token em `POST /api/auth/login` ou `POST /api/auth/register`. O token é temporário e válido apenas enquanto o processo da API estiver ativo.

Contas de demonstração:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@foodpromotion.com` | `admin123` |
| Cliente | `maria@email.com` | `cliente123` |

## Rotas

| Método | Rota | Acesso | Resultado |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Público | Estado da API |
| `POST` | `/api/auth/login` | Público | Autentica `{ "email", "password" }` |
| `POST` | `/api/auth/register` | Público | Cria cliente com `{ "name", "email", "password", "phone?", "cpf?", "city?" }` |
| `GET` | `/api/categories` | Público | Lista categorias |
| `GET` | `/api/products` | Público | Lista produtos; filtros `category`, `search`, `onlyAvailable=true|false`, `sort=expiresAt|discount` |
| `GET` | `/api/products/:id` | Público | Detalha um produto |
| `POST` | `/api/products` | Administrador | Cria produto; responde `201` |
| `PUT` | `/api/products/:id` | Administrador | Atualiza produto |
| `DELETE` | `/api/products/:id` | Administrador | Remove produto; responde `204` |
| `PUT` | `/api/users/:id` | Próprio usuário ou administrador | Atualiza perfil |
| `PUT` | `/api/users/:id/password` | Próprio usuário ou administrador | Altera senha; responde `204` |
| `DELETE` | `/api/users/:id` | Próprio usuário ou administrador | Remove usuário; responde `204` |
| `GET` | `/api/orders` | Autenticado | Lista pedidos; filtros opcionais `status` e `clientId` (clientes veem apenas os próprios) |
| `GET` | `/api/orders/:id` | Dono do pedido ou administrador | Detalha pedido |
| `POST` | `/api/orders` | Cliente | Cria pedido com `items`, `delivery`, `payment` e `notes?`; responde `201` |
| `PATCH` | `/api/orders/:id/status` | Administrador | Altera status do pedido |

Os pedidos aceitam os status `waiting`, `done` e `canceled`, formas de entrega `pickup` e `home`, e pagamentos `pix`, `credit` e `debit`. Itens do pedido têm o formato `{ "productId": 1, "qty": 2 }`.

## Broker de mensageria

A fila principal durável `orders.events` recebe os eventos/notificações persistentes publicados pela API quando um pedido é criado (`order.created`) ou tem o status alterado (`order.status_changed`). O módulo de eventos valida os tipos e os dados obrigatórios antes da publicação; cada envelope contém `eventId`, `eventType`, `occurredAt` e `data`. A topologia cria filas de retentativa duráveis com TTL e backoff exponencial de 1, 2, 4, 8 e 16 segundos (cinco retentativas), além da exchange durável `orders.events.dlx` e da fila durável `orders.events.dead-letter`, vinculada pela routing key `orders.events.dead-letter`. Falhas no processamento são retentadas até o limite; JSON malformado, envelopes fora do contrato e mensagens que esgotam as retentativas são rejeitados sem requeue e encaminhados pelo RabbitMQ à DLQ. Eventos processados com sucesso são confirmados pelo consumidor.

A publicação é confirmada antes de a API responder e efetivar alterações nos pedidos. Se o broker estiver indisponível, a API responde `503 messaging_unavailable` e não altera o pedido. As publicações usam entrega persistente e confirmação do RabbitMQ; os consumidores devem ser idempotentes para lidar com possíveis reentregas.

Inicie a infraestrutura local a partir da raiz do repositório:

```bash
docker compose -f frontend/docker-compose.yml up -d
```

O Compose inicia RabbitMQ, API, consumidor e frontend. A porta AMQP local é `5672` e o painel de desenvolvimento fica em `http://localhost:15672`; configure `RABBITMQ_PORT` e `RABBITMQ_MANAGEMENT_PORT` para alterar as portas publicadas. As credenciais locais padrão são `food_promotion` / `food_promotion_dev`; defina `RABBITMQ_USER` e `RABBITMQ_PASSWORD` no ambiente do Compose para personalizá-las. Alternativamente, configure `RABBITMQ_URL` (no Compose, use o hostname `rabbitmq`; fora dele, o padrão é `amqp://food_promotion:food_promotion_dev@localhost:5672`). Para credenciais com caracteres reservados em URLs, use codificação percentual.

## Respostas e erros

Respostas de sucesso retornam o recurso JSON; remoções e alterações de senha retornam `204 No Content`. Códigos utilizados incluem `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `500` e `503`.

Erros usam sempre o formato:

```json
{
  "error": {
    "code": "not_found",
    "message": "Produto não encontrado."
  }
}
```

## Desenvolvimento e testes

```bash
npm --prefix server ci
npm --prefix server run api
npm --prefix server test
```

Com a API rodando, inicie o consumidor em outro terminal com `npm --prefix server run worker`. O frontend encaminha chamadas `/api` para `http://localhost:3000`; é possível substituir o destino com a variável `VITE_API_PROXY_TARGET`. Este backend em memória é uma base de desenvolvimento, não uma configuração de produção.

O teste de integração exercita publicação, consumo, retentativas e redirecionamento à DLQ em um RabbitMQ real. Com o broker local iniciado, execute:

```bash
RABBITMQ_URL=amqp://food_promotion:food_promotion_dev@localhost:5672 npm --prefix server run test:integration
```

No PowerShell, defina a variável antes do comando:

```powershell
$env:RABBITMQ_URL = "amqp://food_promotion:food_promotion_dev@localhost:5672"
npm.cmd --prefix server run test:integration
```
