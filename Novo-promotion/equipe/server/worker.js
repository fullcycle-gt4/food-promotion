import amqp from 'amqplib';
import { assertMessagingTopology, ORDERS_QUEUE } from './messaging.js';
import { createOrderEventHandler } from './orderEventConsumer.js';

const url = process.env.RABBITMQ_URL ?? 'amqp://food_promotion:food_promotion_dev@localhost:5672';
let closing = false;
let connection;
let channel;

const closeResource = async (resource, name) => {
  if (!resource) return;
  try {
    await resource.close();
  } catch (error) {
    console.error(`Falha ao fechar ${name} do consumidor RabbitMQ.`, error);
  }
};

const consume = async () => {
  const activeConnection = await amqp.connect(url);
  connection = activeConnection;
  activeConnection.on('error', (error) =>
    console.error('Erro na conexão RabbitMQ do consumidor.', error),
  );

  let resolveClosed;
  const closed = new Promise((resolve) => {
    resolveClosed = resolve;
  });
  let connectionClosed = false;
  activeConnection.once('close', () => {
    connectionClosed = true;
    resolveClosed();
  });

  let activeChannel;
  try {
    activeChannel = await activeConnection.createConfirmChannel();
    channel = activeChannel;
    activeChannel.on('error', (error) =>
      console.error('Erro no canal do consumidor RabbitMQ.', error),
    );
    activeChannel.once('close', resolveClosed);
    await assertMessagingTopology(activeChannel);
    await activeChannel.prefetch(1);
    await activeChannel.consume(ORDERS_QUEUE, createOrderEventHandler({ channel: activeChannel }));

    console.log(`Consumidor conectado à fila ${ORDERS_QUEUE}.`);
    await closed;
  } finally {
    if (channel === activeChannel) channel = undefined;
    if (connection === activeConnection) connection = undefined;
    if (!closing && !connectionClosed) await closeResource(activeConnection, 'conexão');
  }
};

const shutdown = async () => {
  closing = true;
  const activeConnection = connection;
  const activeChannel = channel;
  connection = undefined;
  channel = undefined;
  if (activeConnection) await closeResource(activeConnection, 'conexão');
  else await closeResource(activeChannel, 'canal');
};
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

while (!closing) {
  try {
    await consume();
  } catch (error) {
    if (!closing) console.error('Consumidor perdeu a conexão com o RabbitMQ.', error);
  }

  if (!closing) await new Promise((resolve) => setTimeout(resolve, 5000));
}
