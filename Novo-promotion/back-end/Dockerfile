FROM node:20-alpine AS production-dependencies

ENV NODE_ENV=production
WORKDIR /app

COPY back-end/package.json back-end/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

FROM node:20-alpine AS development

ENV NODE_ENV=development
WORKDIR /app

COPY back-end/package.json back-end/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY --chown=node:node back-end/src ./src
COPY back-end/mocks ./mocks
COPY --chown=node:node shared /shared

USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node back-end/package.json ./package.json
COPY --chown=node:node back-end/src ./src
COPY back-end/mocks ./mocks
COPY --chown=node:node shared /shared

USER node
EXPOSE 3000
CMD ["npm", "start"]
