# API Prisma da equipe

API Express com Prisma e SQLite para gerenciar usuários e publicações. O banco padrão é `dev.db` nesta pasta; defina `DATABASE_URL` para usar outro arquivo.

## Executar

```powershell
npm ci
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

O servidor escuta em `http://localhost:3001` por padrão. O banco local `dev.db` não é versionado; a migration cria as tabelas nesse arquivo.

## Rotas

| Método | Caminho | Resultado |
| --- | --- | --- |
| `GET` | `/health` | Estado da API |
| `GET` | `/users` | Lista usuários e publicações |
| `GET` | `/users/:id` | Consulta um usuário e suas publicações |
| `POST` | `/users` | Cria usuário com `email` e `name` opcional |
| `PUT` | `/users/:id` | Atualiza `email` e/ou `name` |
| `DELETE` | `/users/:id` | Remove usuário |
| `GET` | `/posts` | Lista publicações e seus autores |
| `GET` | `/posts/:id` | Consulta uma publicação e seu autor |
| `POST` | `/posts` | Cria publicação com `title`, `authorId`, `content` opcional e `published` opcional |
| `PUT` | `/posts/:id` | Atualiza os campos da publicação |
| `DELETE` | `/posts/:id` | Remove publicação |

Os corpos das requisições usam JSON. A API responde `400` para dados inválidos, `404` para registros inexistentes e `409` para e-mails duplicados. Erros inesperados são registrados no servidor e retornam `500`.

## Verificações

```bash
npm run typecheck
npm test
```
