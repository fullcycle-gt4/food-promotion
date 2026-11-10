# Food Promotion API

API única do projeto, criada com Node.js, Express e TypeScript. Reúne o catálogo e as rotas CRUD de usuários e publicações.

## Requisitos

- Node.js 20 ou superior
- PostgreSQL para as integrações atuais do catálogo
- SQLite para as rotas CRUD de usuários e publicações

## Desenvolvimento local

No PowerShell, dentro da raiz do repositório:

```powershell
Copy-Item backend\.env.example backend\.env
npm --prefix backend ci
npm --prefix backend run prisma:generate
```

Escolha um modo de execução:

```powershell
# Imagem de produção da API e PostgreSQL
docker compose up --build -d db api

# API em modo de desenvolvimento com Node watch e montagem do código
docker compose --profile dev up --build -d db api-dev
```

Em ambos os modos, o Compose aguarda o PostgreSQL ficar saudável antes de iniciar a API. Os serviços compartilham a rede `app-network`; a API acessa o banco pelo host `db`. Os dados do banco persistem no volume nomeado `postgres_data`.

- API: `http://localhost:3000` (ou a porta `API_PORT` definida no `.env`)
- API em desenvolvimento: `http://localhost:3001` (ou a porta `API_DEV_PORT` definida no `.env`)
- Verificação de saúde: `http://localhost:3000/api/v1/health`
- Documentação interativa: `http://localhost:3000/api/docs`
- Especificação OpenAPI 3.1: `http://localhost:3000/api/openapi.json`

Para iniciar a API diretamente no Node.js sem Docker, configure `backend/.env` usando `backend/.env.example`, instale as dependências e execute `npm --prefix backend run dev`. O comando aplica as migrations Prisma do SQLite antes de iniciar o servidor.

O SQLite usa `DATABASE_URL` (padrão `file:./dev.db`) e permanece separado do PostgreSQL usado pelo catálogo. No Compose, os arquivos SQLite persistem no volume `prisma_data`; a migration é aplicada automaticamente ao iniciar a API.

As rotas CRUD mantêm o contrato original e ficam disponíveis no mesmo servidor:

| Método | Caminho | Resultado |
| --- | --- | --- |
| `GET`, `POST` | `/users` | Lista ou cria usuários |
| `GET`, `PUT`, `DELETE` | `/users/:id` | Consulta, atualiza ou remove um usuário |
| `GET`, `POST` | `/posts` | Lista ou cria publicações |
| `GET`, `PUT`, `DELETE` | `/posts/:id` | Consulta, atualiza ou remove uma publicação |

Os arquivos de aplicação e testes usam `.ts`. O comando `npm --prefix backend run typecheck` valida os tipos sem gerar arquivos, e `npm --prefix backend test` executa os testes TypeScript.

Comandos úteis:

```powershell
docker compose ps
docker compose logs -f api db
docker compose --profile dev logs -f api-dev db
docker compose down
```

`docker compose down` mantém os dados do volume. Para remover intencionalmente o banco local junto com os volumes, use `docker compose down --volumes`.

O `backend/Dockerfile` usa estágios separados para dependências de produção, desenvolvimento (tsx watch) e runtime de produção. A imagem final executa como usuário não-root e inclui somente dependências de produção. O Compose publica as portas da API e do banco para acesso local. A configuração do banco vem do `.env` da raiz; use `.env.example` como modelo e substitua a senha ilustrativa antes de iniciar os serviços.

O volume `postgres_data` persiste os dados do PostgreSQL entre reinicializações e `docker compose down`. A API atualmente lê os dados do catálogo a partir de fixtures; apesar de receber as configurações do PostgreSQL, ainda não persiste os dados de negócio no banco.

## Organização do backend

O código em `src/` separa responsabilidades por camada:

| Pasta/arquivo | Responsabilidade |
| --------------- | ------------------ |
| `routes/` | Declara os caminhos HTTP e associa cada rota ao controller correspondente. |
| `controllers/` | Recebe `request`/`response`, valida a entrada e converte o resultado do serviço em resposta HTTP. |
| `services/` | Implementa as operações do catálogo sem depender do Express. |
| `validators/` | Valida e converte parâmetros de rota e query string. |
| `errors/` | Define erros da API e centraliza os middlewares para erros e rotas inexistentes. |
| `middleware/` | Contém middlewares transversais, como a geração do identificador de requisição. |
| `fixtures/` | Carrega e prepara os dados simulados usados pela API. |
| `mappers/` | Converte os dados das fixtures para os contratos públicos da API. |

Os arquivos JSON de dados simulados ficam separados do código em `backend/mocks/`. O fluxo de uma requisição de catálogo é `routes → controllers → validators/services → errors/resposta`; assim, regras do catálogo não ficam embutidas nos arquivos de rotas.

- Documentação interativa: `http://localhost:3000/api/docs`
- Especificação OpenAPI 3.1: `http://localhost:3000/api/openapi.json`
- Verificação de saúde: `GET /api/v1/health` (o caminho legado `GET /api/health` continua disponível)

## Padrão REST

As rotas novas usam o prefixo versionado `/api/v1` e substantivos no plural para coleções:

| Método | Padrão | Uso |
| -------- | -------- | ----- |
| `GET` | `/resources` | Listar/filtrar recursos; coleções paginadas usam `page` e `pageSize` |
| `GET` | `/resources/{id}` | Consultar um recurso |
| `POST` | `/resources` | Criar um recurso (retornar `201 Created` e cabeçalho `Location`) |
| `PUT` | `/resources/{id}` | Substituir integralmente um recurso |
| `PATCH` | `/resources/{id}` | Alterar parcialmente um recurso |
| `DELETE` | `/resources/{id}` | Remover um recurso (retornar `204 No Content` sem envelope) |

Os endpoints públicos de leitura do catálogo são:

- `GET /api/v1/categories`
- `GET /api/v1/products`
- `GET /api/v1/products/{id}`

`GET /api/v1/products` aceita `category`, `search`, `onlyAvailable`, `sort`, `page` e `pageSize`. `onlyAvailable` assume `true`; `page` assume `1`; `pageSize` assume `20`, com máximo `100`. Produtos vencidos não são retornados no catálogo público. Os dados vêm das fixtures e não são persistidos no PostgreSQL.

## Envelopes HTTP

As rotas do catálogo retornam sucesso no envelope `data` e `meta`. `meta.requestId` e o cabeçalho `X-Request-Id` identificam a requisição; respostas paginadas também contêm `meta.pagination`. As rotas CRUD legadas de `/users` e `/posts` continuam retornando os recursos diretamente para preservar o contrato existente.

```json
{
  "data": [{ "id": 7, "name": "Suco de Uva Integral 1L" }],
  "meta": {
    "pagination": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 },
    "requestId": "3f9dfb7c-7014-4c68-a5cb-048975998df8"
  }
}
```

Erros do catálogo usam o envelope abaixo para validação, rota/recurso inexistente, JSON inválido e falhas internas:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Um ou mais parâmetros são inválidos.",
    "details": [{ "field": "page", "message": "Informe um número inteiro maior que zero." }],
    "requestId": "3f9dfb7c-7014-4c68-a5cb-048975998df8"
  }
}
```

Os endpoints e schemas publicados em OpenAPI são servidos em `/api/openapi.json`; a interface Swagger UI está em `/api/docs`. O CRUD de usuários e publicações permanece disponível em `/users` e `/posts`, com persistência SQLite gerenciada pelo Prisma. Rotas de pedidos ainda não fazem parte desta API.

As rotas CRUD legadas retornam erros no formato `{ "error": "mensagem" }` para manter compatibilidade com os clientes existentes.

As configurações PostgreSQL são lidas do `.env` da raiz. O módulo `src/config/database.ts` exporta o pool e uma função simples de teste de conexão; a conexão só ocorre quando uma consulta é executada.

## Fixtures da API

Os payloads de exemplo ficam em `backend/mocks/` e são carregados por `src/fixtures/index.ts`. Os mapeadores mantêm o contrato documentado em `backend/mocks/README.md`, recalculam descontos pela data de vencimento, omitem senhas das respostas de usuários e validam referências de clientes e produtos nos pedidos.

Execute `npm --prefix backend test` para validar os mapeamentos e as referências entre fixtures. As credenciais em `users.json` são somente dados de teste e não devem ser usadas como autenticação de produção.
