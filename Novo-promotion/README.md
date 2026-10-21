<div align="center">

# ðŸ·ï¸ Food Promotion Microservice

> **MicroserviÃ§o de GestÃ£o de PromoÃ§Ãµes e Descontos por Vencimento de Produtos.**

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-iniciando-o-projeto-com-docker)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange?style=for-the-badge)](#-arquitetura-e-padroes)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-licenca)

</div>

---

## ðŸ“Œ Sobre o Projeto

O **Food Promotion** Ã© um microserviÃ§o integrante da plataforma de autoatendimento para supermercados. Sua finalidade Ã© gerenciar **campanhas promocionais**, aplicando **descontos dinÃ¢micos em produtos prÃ³ximos da data de vencimento**.

Com isso, o estabelecimento reduz perdas de estoque (desperdÃ­cio de alimentos) e disponibiliza preÃ§os reduzidos aos clientes no totem ou aplicativo de pedidos.

## Estrutura consolidada

`Novo-promotion` usa a aplicaÃ§Ã£o de `food-promotion` como frontend principal. As outras implementaÃ§Ãµes e os serviÃ§os da equipe foram mantidos em subpastas, sem misturar aplicaÃ§Ãµes com interfaces e contratos de API diferentes:

- `src/` e `back-end/`: aplicaÃ§Ã£o principal e API original.
- `frontend-alternativo/`: implementaÃ§Ã£o de `food-promotion-main`.
- `equipe/frontend/` e `equipe/server/`: aplicaÃ§Ã£o da equipe integrada Ã  API com mensageria RabbitMQ.
- `equipe/backend/`: API CRUD de usuÃ¡rios e publicaÃ§Ãµes, com controllers em classes e Prisma/SQLite. Consulte [equipe/backend/README.md](./equipe/backend/README.md).

As pastas originais foram preservadas. Os repositÃ³rios Git nÃ£o foram copiados; as dependÃªncias foram instaladas no destino a partir dos lockfiles, e os builds podem ser gerados novamente com os comandos abaixo.

### Aplicação principal

O frontend principal utiliza as telas de `frontend-alternativo`: catálogo, detalhes do produto, carrinho, pedidos, perfil do cliente e administração. A caixa **Minha seleção** do catálogo compartilha o carrinho dessas telas; **Comprar** abre o carrinho, onde o cliente informa a retirada e o pagamento antes de confirmar o pedido.

```bash
npm ci
npm run dev
```

Para gerar o build e executar os testes:

```bash
npm run build
npm test
```

### API REST independente

O backend Express pode ser iniciado na raiz do repositório:

```bash
npm --prefix back-end ci
npm --prefix back-end run dev
```

A API está disponível em `http://localhost:3000`. A documentação interativa Swagger
está em `http://localhost:3000/api/docs`, e a especificação OpenAPI está em
`http://localhost:3000/api/openapi.json`.

Os endpoints versionados de leitura do catálogo usam `/api/v1`. Nesta etapa, os dados
vêm das fixtures e as operações de escrita ainda não estão habilitadas. Consulte
[back-end/README.md](./back-end/README.md) para ver o contrato REST, os envelopes e
os endpoints disponíveis.

Para iniciar a API de produção e o PostgreSQL, copie `.env.example` para `.env` e
execute:

```bash
docker compose up --build -d db api
```

Para desenvolvimento com reinicialização automática do Node, execute:

```bash
docker compose --profile dev up --build -d db api-dev
```

A API de desenvolvimento usa a porta `3001` por padrão. O Dockerfile separa os estágios
de desenvolvimento e produção. O Compose configura uma rede compartilhada e um volume
persistente para o PostgreSQL. Também verifica a saúde do banco e aguarda até que esteja
pronto antes de iniciar a API. O catálogo ainda usa fixtures e não persiste dados de
negócio no banco. Consulte [back-end/README.md](./back-end/README.md) para mais detalhes.

### AplicaÃ§Ã£o e API da equipe

Com Docker Desktop em execuÃ§Ã£o:

```bash
docker compose -f equipe/frontend/docker-compose.yml up --build
```

A aplicaÃ§Ã£o da equipe fica em `http://localhost:5173`; a API fica em `http://localhost:3000`. Consulte [equipe/API.md](./equipe/API.md) para rotas, autenticaÃ§Ã£o e mensageria. Para testar a API da equipe sem Docker, instale as dependÃªncias com `npm --prefix equipe/server ci` e execute `npm --prefix equipe/server test`.

### Frontend alternativo

Para executar a implementaÃ§Ã£o alternativa:

```bash
npm --prefix frontend-alternativo ci
npm --prefix frontend-alternativo run dev
```

---

## ðŸ› ï¸ Tech Stack & Arquitetura

- **Linguagem & Runtime:** React.js 
- **ContainerizaÃ§Ã£o:** Docker e Docker Compose

---

## ðŸš€ Iniciando o Projeto com Docker

### ðŸ“‹ PrÃ©-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execuÃ§Ã£o.
* [Git](https://git-scm.com/) instalado.

---

### ExecuÃ§Ã£o PadrÃ£o (Nginx)

1. Clone o repositÃ³rio e entre na pasta:
   ```bash
   git clone https://github.com/fullcycle-gt4/food-promotion
   cd food-promotion
   ```

2. Copie `.env.example` para `.env` (PowerShell: `Copy-Item .env.example .env`; Bash: `cp .env.example .env`). Altere `POSTGRES_USER` e substitua o valor de exemplo de `POSTGRES_PASSWORD`; ajuste tambÃ©m `APP_PORT`, `DEV_PORT` ou `DB_PORT` se necessÃ¡rio. O Compose exige essas credenciais via `.env`. Esse arquivo Ã© ignorado pelo Git e nÃ£o deve ser versionado.

3. Construa as imagens e inicie o frontend, a API e o PostgreSQL:
   ```bash
   docker compose up -d --build
   ```

4. Confira o estado e a saúde dos containers. O endpoint `GET /health` do Nginx deve responder `200` com `ok`; depois abra `http://localhost:8080` (ou a porta definida em `APP_PORT`). A API fica disponível em `http://localhost:3000` (ou `API_PORT`), com healthcheck em `/api/v1/health`:
   ```bash
   docker compose ps
   curl http://localhost:8080/health
   ```

5. Para parar e remover os containers sem apagar os dados persistidos:
   ```bash
   docker compose down
   ```

O banco usa o volume nomeado `postgres_data`, que Ã© mantido por `docker compose down`. NÃ£o use `docker compose down -v` se quiser preservar os dados.

### Desenvolvimento (Vite)

1. Inicie o perfil de desenvolvimento com hot reload:
   ```bash
   docker compose --profile dev up -d --build frontend-dev
   ```

2. Acesse `http://localhost:5173` (ou a porta definida em `DEV_PORT`). O Vite usa a mesma porta publicada pelo Compose. O código do workspace é montado no container; `node_modules` usa um volume Docker separado. O PostgreSQL mantém seus dados no volume `postgres_data`.

3. Para parar o serviÃ§o de desenvolvimento:
   ```bash
   docker compose --profile dev down
   ```

O frontend atual ainda utiliza dados mockados e nÃ£o lÃª nem grava no PostgreSQL. O banco jÃ¡ Ã© iniciado e persistido pelo Compose para a integraÃ§Ã£o com uma API futura.

ðŸ‘¥ Equipe do ProjetoDesenvolvido pelo grupo GT4 - Full Cycle.

GitHub: https://github.com/DeilsonGilmar 
GitHub: https://github.com/senna47 
GitHub: https://github.com/pomptrash 
GitHub: https://github.com/amandapaulav 
GitHub: https://github.com/pedrorochaneto 
GitHub: https://github.com/EmillioMartins 
