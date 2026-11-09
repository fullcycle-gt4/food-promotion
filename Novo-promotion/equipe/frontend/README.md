<div align="center">

# Food Promotion Microservice

> **Microserviço de Gestão de Promoções e Descontos por Vencimento de Produtos.**

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#iniciando-o-projeto-com-docker)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange?style=for-the-badge)](#arquitetura-e-padroes)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-licenca)

</div>

---

## Sobre o Projeto

O **Food Promotion** é um microserviço integrante da plataforma de autoatendimento para supermercados. Sua finalidade é gerenciar **campanhas promocionais**, aplicando **descontos dinâmicos em produtos próximos da data de vencimento**.

Com isso, o estabelecimento reduz perdas de estoque (desperdício de alimentos) e disponibiliza preços reduzidos aos clientes no totem ou aplicativo de pedidos.

## Fluxograma do projeto

O fluxograma abaixo apresenta a arquitetura da aplicação e os fluxos entre frontend, API, validações e dados:

![Fluxograma da arquitetura do Food Promotion](<./src/Fluxograma/fluxograma total.png>)

---

## Tech Stack & Arquitetura

- **Linguagem & Runtime:** React.js, Node.js e Express
- **Containerização:** Docker e Docker Compose

---

## Iniciando o Projeto com Docker

### Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.
* [Git](https://git-scm.com/) instalado.

---

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/fullcycle-gt4/food-promotion

1. Navegue até o diretório do projeto:
   ```bash
   cd food-promotion

2. Suba os containers da aplicação:
   ```bash
   docker compose -f frontend/docker-compose.yml up -d

3. Acesse a interface e verifique a API:
   ```bash
   http://localhost:5173
   http://localhost:3000/api/health

As rotas, parâmetros, autenticação e exemplos de erro estão em [API.md](../API.md). Para executar os testes da API localmente, use `npm test`.

Equipe do Projeto — Desenvolvido pelo grupo GT4 - Full Cycle.

GitHub: https://github.com/DeilsonGilmar 
GitHub: https://github.com/senna47 
GitHub: https://github.com/pomptrash 
GitHub: https://github.com/amandapaulav 
GitHub: https://github.com/EmillioMartins 
GitHub: https://github.com/carolemosdev