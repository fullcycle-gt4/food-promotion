# Food Promotion

Aplicação web para compras de produtos em promoção e gerenciamento de produtos e pedidos. O projeto usa React, React Router e Vite; no estado atual, os serviços usam dados simulados em `src/mocks` e não dependem de uma API externa.

Repositório: https://github.com/EmillioMartins/promotion_food

## Requisitos

- Node.js 20 ou superior e npm
- Docker Desktop, caso prefira executar com Docker Compose

## Executar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173 no navegador.

## Executar com Docker Compose

```bash
docker compose up
```

A aplicação ficará disponível em http://localhost:5173. Para encerrar, pressione `Ctrl+C` ou execute `docker compose down` em outro terminal.

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos de produção são gerados em `dist/`.

## Funcionalidades

- Área do cliente: catálogo, detalhes do produto, carrinho, pedidos e perfil.
- Área administrativa: cadastro e edição de produtos, gestão de pedidos e perfil.
- Autenticação e dados de demonstração mantidos localmente em mocks.

## Organização do projeto

- `src/pages/`: telas de cliente, administração e autenticação.
- `src/components/` e `src/layouts/`: componentes e estruturas compartilhadas.
- `src/context/`: estado de autenticação e carrinho.
- `src/services/`: serviços e camada HTTP.
- `src/mocks/`: dados simulados usados durante o desenvolvimento.
- `__src/`: implementações e páginas de uma versão anterior/em desenvolvimento.

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: gera o build de produção.
- `npm run preview`: serve localmente o build gerado.