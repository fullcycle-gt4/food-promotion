FROM node:20-alpine AS production-dependencies

ENV NODE_ENV=production
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./prisma.config.ts
RUN apk add --no-cache python3 make g++
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm run prisma:generate \
    && npm cache clean --force

FROM node:20-alpine AS development

ENV NODE_ENV=development
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci --no-audit --no-fund

COPY --chown=node:node backend/src ./src
COPY backend/mocks ./mocks
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node shared /shared
RUN npm run prisma:generate \
    && mkdir -p /app/data \
    && chown -R node:node /app/data

USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache libstdc++

COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=production-dependencies --chown=node:node /app/generated ./generated
COPY --chown=node:node backend/package.json ./package.json
COPY --chown=node:node backend/src ./src
COPY backend/mocks ./mocks
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node shared /shared
RUN mkdir -p /app/data && chown -R node:node /app/data

USER node
EXPOSE 3000
CMD ["npm", "start"]
