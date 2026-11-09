# Food Promotion API

API independente do frontend, criada com Node.js, Express e TypeScript.

## Requisitos

- Node.js 20 ou superior
- PostgreSQL disponível para as próximas rotas que usarem o banco

## Desenvolvimento local

No PowerShell, dentro da raiz do repositório:

```powershell
Copy-Item .env.example .env
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

Para iniciar a API diretamente no Node.js sem Docker, instale as dependências a partir do lockfile e execute `npm --prefix back-end run dev`. Nesse caso, configure `back-end/.env` para apontar o PostgreSQL em execução no host.

Os arquivos de aplicação e testes usam `.ts`. O comando `npm --prefix back-end run typecheck` valida os tipos sem gerar arquivos, e `npm --prefix back-end test` executa os testes TypeScript.

Comandos úteis:

```powershell
docker compose ps
docker compose logs -f api db
docker compose --profile dev logs -f api-dev db
docker compose down
```

`docker compose down` mantém os dados do volume. Para remover intencionalmente o banco local junto com os volumes, use `docker compose down --volumes`.

O `back-end/Dockerfile` usa estágios separados para dependências de produção, desenvolvimento (tsx watch) e runtime de produção. A imagem final executa como usuário não-root e inclui somente dependências de produção. O Compose publica as portas da API e do banco para acesso local. A configuração do banco vem de `.env`; use `.env.example` como modelo e substitua a senha ilustrativa antes de iniciar os serviços.

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

Os arquivos JSON de dados simulados ficam separados do código em `back-end/mocks/`. O fluxo de uma requisição de catálogo é `routes → controllers → validators/services → errors/resposta`; assim, regras do catálogo não ficam embutidas nos arquivos de rotas.

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

Métodos e rotas de escrita são convenções para as próximas etapas; ainda não estão expostos. Nesta primeira etapa estão implementados os endpoints públicos de leitura do catálogo:

- `GET /api/v1/categories`
- `GET /api/v1/products`
- `GET /api/v1/products/{id}`

`GET /api/v1/products` aceita `category`, `search`, `onlyAvailable`, `sort`, `page` e `pageSize`. `onlyAvailable` assume `true`; `page` assume `1`; `pageSize` assume `20`, com máximo `100`. Produtos vencidos não são retornados no catálogo público. Os dados vêm das fixtures e não são persistidos no PostgreSQL.

## Envelopes HTTP

Toda resposta JSON de sucesso usa `data` e `meta`. `meta.requestId` e o cabeçalho `X-Request-Id` identificam a requisição. Respostas paginadas também contêm os dados de paginação em `meta.pagination`.

```json
{
  "data": [{ "id": 7, "name": "Suco de Uva Integral 1L" }],
  "meta": {
    "pagination": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 },
    "requestId": "3f9dfb7c-7014-4c68-a5cb-048975998df8"
  }
}
```

Erros usam o mesmo formato para validação, rota/recurso inexistente, JSON inválido e falhas internas:

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

Os endpoints e schemas publicados em OpenAPI são servidos em `/api/openapi.json`; a interface Swagger UI está em `/api/docs`. Usuários, pedidos e operações de escrita só serão adicionados após definição de autenticação/autorização e persistência.

As configurações PostgreSQL ficam em `back-end/.env`. O módulo `src/config/database.ts` exporta o pool e uma função simples de teste de conexão; a conexão só ocorre quando uma consulta é executada.

## Fixtures da API

Os payloads de exemplo ficam em `back-end/mocks/` e são carregados por `src/fixtures/index.ts`. Os mapeadores mantêm o contrato documentado em `back-end/mocks/README.md`, recalculam descontos pela data de vencimento, omitem senhas das respostas de usuários e validam referências de clientes e produtos nos pedidos.

Execute `npm --prefix back-end test` para validar os mapeamentos e as referências entre fixtures. As credenciais em `users.json` são somente dados de teste e não devem ser usadas como autenticação de produção.
