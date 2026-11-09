import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import amqp from 'amqplib';
import { assertOrderEventData } from './events.js';
import {
  DEFAULT_QUEUE_NAMES,
} from './queueConfig.js';

export {
  BASE_RETRY_DELAY_MS,
  DEFAULT_QUEUE_NAMES,
  DEAD_LETTER_EXCHANGE,
  DEAD_LETTER_QUEUE,
  DEAD_LETTER_ROUTING_KEY,
  MAX_RETRY_ATTEMPTS,
  ORDERS_QUEUE,
} from './queueConfig.js';

export async function assertMessagingTopology(
  channel,
  { queueNames = DEFAULT_QUEUE_NAMES } = {},
) {
  await channel.assertExchange(queueNames.deadLetterExchange, 'direct', { durable: true });
  await channel.assertQueue(queueNames.deadLetter, { durable: true });
  await channel.bindQueue(
    queueNames.deadLetter,
    queueNames.deadLetterExchange,
    queueNames.deadLetterRoutingKey,
  );
  await channel.assertQueue(queueNames.main, {
    durable: true,
    deadLetterExchange: queueNames.deadLetterExchange,
    deadLetterRoutingKey: queueNames.deadLetterRoutingKey,
  });
  for (const retry of queueNames.retries) {
    await channel.assertQueue(retry.name, {
      durable: true,
      messageTtl: retry.delayMs,
      deadLetterExchange: '',
      deadLetterRoutingKey: queueNames.main,
    });
  }
}

export async function createEventPublisher({
  url = process.env.RABBITMQ_URL ?? 'amqp://food_promotion:food_promotion_dev@localhost:5672',
  amqpClient = amqp,
  queueNames = DEFAULT_QUEUE_NAMES,
} = {}) {
  let connection;
  let channel;
  let connecting;

  const connect = async () => {
    if (channel) return;
    if (connecting) return connecting;

    const pendingConnection = (async () => {
      let nextConnection = connection;
      let nextChannel;
      try {
        if (!nextConnection) {
          nextConnection = await amqpClient.connect(url);
          nextConnection.on('error', (error) =>
            console.error('Erro na conexão RabbitMQ.', error),
          );
          nextConnection.on('close', () => {
            if (connection === nextConnection) {
              connection = undefined;
              channel = undefined;
            }
          });
        }

        nextChannel = await nextConnection.createConfirmChannel();
        let channelClosed = false;
        nextChannel.on('error', (error) => console.error('Erro no canal RabbitMQ.', error));
        nextChannel.on('close', () => {
          channelClosed = true;
          if (channel === nextChannel) channel = undefined;
        });
        await assertMessagingTopology(nextChannel, { queueNames });
        if (channelClosed) throw new Error('O canal RabbitMQ foi fechado durante a inicialização.');

        connection = nextConnection;
        channel = nextChannel;
      } catch (error) {
        if (nextChannel) {
          if (channel === nextChannel) channel = undefined;
          try {
            await nextChannel.close();
          } catch (closeError) {
            console.error('Falha ao fechar o canal RabbitMQ após erro de conexão.', closeError);
          }
        }
        if (connection === nextConnection) connection = undefined;
        if (nextConnection) {
          try {
            await nextConnection.close();
          } catch (closeError) {
            console.error('Falha ao fechar a conexão RabbitMQ após erro de inicialização.', closeError);
          }
        }
        throw error;
      }
    })();
    connecting = pendingConnection;

    try {
      await pendingConnection;
    } finally {
      if (connecting === pendingConnection) connecting = undefined;
    }
  };

  const publish = async (eventType, data) => {
    assertOrderEventData(eventType, data);
    await connect();
    const event = {
      eventId: randomUUID(),
      eventType,
      occurredAt: new Date().toISOString(),
      data,
    };
    const activeChannel = channel;
    try {
      const accepted = activeChannel.sendToQueue(
        queueNames.main,
        Buffer.from(JSON.stringify(event)),
        {
          persistent: true,
          contentType: 'application/json',
          messageId: event.eventId,
          type: event.eventType,
        },
      );
      if (!accepted) await once(activeChannel, 'drain');
      await activeChannel.waitForConfirms();
    } catch (error) {
      if (channel === activeChannel) channel = undefined;
      try {
        await activeChannel.close();
      } catch (closeError) {
        console.error('Falha ao fechar o canal RabbitMQ após erro de publicação.', closeError);
      }
      throw error;
    }
    return event;
  };

  await connect();

  return {
    publish,
    async close() {
      const activeChannel = channel;
      const activeConnection = connection;
      channel = undefined;
      connection = undefined;
      if (activeChannel) await activeChannel.close();
      if (activeConnection) await activeConnection.close();
    },
  };
}
