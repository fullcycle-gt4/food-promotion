import { createApp } from './app.js';
import { createEventPublisher } from './messaging.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser um número entre 1 e 65535.');
}

const publisher = await createEventPublisher();
const server = createApp({ publishEvent: publisher.publish }).listen(port, host, () => {
  console.log(`Food Promotion API ouvindo em http://${host}:${port}`);
});

const shutdown = async (signal) => {
  console.log(`Recebido ${signal}; encerrando a API.`);
  try {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await publisher.close();
  } catch (error) {
    console.error('Falha ao encerrar a API corretamente.', error);
    process.exitCode = 1;
  }
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
