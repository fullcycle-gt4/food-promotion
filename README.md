# FOOD PROMOTION
Descontos em produtos próximos ao vencimento



## Iniciando o projeto com Docker
### Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.
---
### Docker rodando, siga os passos abaixo:
1. Clone o repositório:

    `git clone https://github.com/fullcycle-gt4/food-promotion`

2. Navegue até o seu repositório local

    ` cd SEU DIRETÓRIO`

3. Execute o seguinte comando para criar a imagem Docker do projeto localmente

    ` docker build -t food-promotion-frontend .`

4. Agora, crie o container da imagem

    ` docker run -d -p 8080:8080 --name food-promotion-app food-promotion-frontend ` 

5. Acesse via localhost

    ` localhost:8080 ` 

6. Aproveite as promoções.

### Comandos Úteis
1. Parar a aplicação:

    `docker stop food-promotion-app`

2. Iniciar novamente: 

    `docker start food-promotion-app`

3. Remover o container:

    ` docker rm -f food-promotion-app`