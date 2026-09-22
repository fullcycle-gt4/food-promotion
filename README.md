<div align="center">

# 🏷️ Food Promotion Microservice

> **Microserviço de Gestão de Promoções e Descontos por Vencimento de Produtos.**

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-iniciando-o-projeto-com-docker)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange?style=for-the-badge)](#-arquitetura-e-padroes)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-licenca)

</div>

---

## 📌 Sobre o Projeto

O **Food Promotion** é um microserviço integrante da plataforma de autoatendimento para supermercados. Sua finalidade é gerenciar **campanhas promocionais**, aplicando **descontos dinâmicos em produtos próximos da data de vencimento**.

Com isso, o estabelecimento reduz perdas de estoque (desperdício de alimentos) e disponibiliza preços reduzidos aos clientes no totem ou aplicativo de pedidos.

---

## 🛠️ Tech Stack & Arquitetura

- **Linguagem & Runtime:** Go / Node.js *(Ajuste para a linguagem exata usada no repositório)*
- **Banco de Dados:** MongoDB / PostgreSQL *(Dependendo da estratégia de persistência)*
- **Containerização:** Docker e Docker Compose
- **Padrões de Projeto:** Clean Architecture, DDD (*Domain-Driven Design*), REST API

---

## 🚀 Iniciando o Projeto com Docker

### 📋 Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.
* [Git](https://git-scm.com/) instalado.

---

### ⚙️ Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/fullcycle-gt4/food-promotion.git](https://github.com/fullcycle-gt4/food-promotion.git)



1. Navegue até o diretório do projeto:

   cd food-promotion

2. Suba os containers da aplicação e banco de dados:

   Bash
   docker compose up -d --build

3. Acesse e teste a API via localhost:

   http://localhost:8080

🛣️ API Endpoints PrincipaisMétodoEndpointDescriçãoGET/healthHealthcheck da aplicaçãoGET/productsLista 

os produtos cadastrados e seus valores normais/promocionaisPOST/productsCadastra um novo produto para controle de vencimentoGET/promotionsRetorna apenas os produtos em promoção ativaPOST/promotionsCria uma nova regra/campanha de desconto por vencimento


👥 Equipe do ProjetoDesenvolvido pelo grupo GT4 - Full Cycle.


GitHub: https://github.com/DeilsonGilmar
GitHub: https://github.com/senna47
GitHub: https://github.com/pomptrash
GitHub: https://github.com/amandapaulav
GitHub: https://github.com/pedrorochaneto
GitHub: https://github.com/EmillioMartins






📄 LicençaEste projeto está sob a licença MIT - consulte o arquivo LICENSE para mais detalhes.
