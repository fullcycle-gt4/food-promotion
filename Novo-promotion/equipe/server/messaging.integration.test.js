import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import amqp from 'amqplib';
import { test } from 'node:test';
import { ORDER_EVENT_TYPES } from './events.js';
import {
  assertMessagingTopology,
  createEventPublisher,
} from './messaging.js';
import { createQueueNames } from './queueConfig.js';
import { createOrderEventHandler } from './orderEventConsumer.js';

const brokerUrl = process.env.RABBITMQ_URL;

test(
  'RabbitMQ publishes, consumes with retries, then routes exhausted messages to DLQ',
  { skip: !brokerUrl && 'Set RABBITMQ_URL to run the RabbitMQ integration test.' },
  async (t) => {
    const queueNames = createQueueNames(`integration.${randomUUID()}`, 2, { baseDelayMs: 50 });
    const publisher = await createEventPublisher({ url: brokerUrl, queueNames });
    const connection = await amqp.connect(brokerUrl);
    const channel = await connection.createConfirmChannel();
    const deliveries = [];
    let attempts = 0;
    let resolveDeadLetter;
    const deadLettered = new Promise((resolve) => {
      resolveDeadLetter = resolve;
    });
    const timeout = setTimeout(
      () => resolveDeadLetter(new Error('Timed out waiting for the message to reach the DLQ.')),
      10_000,
    );
    timeout.unref();
    t.after(async () => {
      clearTimeout(timeout);
      await channel.close().catch(() => {});
      await connection.close().catch(() => {});
      await publisher.close().catch(() => {});
      const cleanupChannel = await amqp.connect(brokerUrl);
      try {
        for (const queue of [
          queueNames.main,
          queueNames.deadLetter,
          ...queueNames.retries.map(({ name }) => name),
        ])
          await cleanupChannel.deleteQueue(queue);
        await cleanupChannel.deleteExchange(queueNames.deadLetterExchange);
      } finally {
        await cleanupChannel.close();
      }
    });

    await assertMessagingTopology(channel, { queueNames });
    await channel.consume(
      queueNames.main,
      createOrderEventHandler({
        channel,
        queueNames,
        maxRetries: 2,
        baseDelayMs: 50,
        processEvent: async () => {
          attempts += 1;
          throw new Error('forced integration failure');
        },
        logger: { log() {}, error() {} },
      }),
    );
    await channel.consume(queueNames.deadLetter, (message) => {
      if (!message) return;
      deliveries.push(message);
      channel.ack(message);
      resolveDeadLetter(message);
    });

    const published = await publisher.publish(ORDER_EVENT_TYPES.CREATED, {
      id: 101,
      clientId: 2,
      status: 'waiting',
      items: [{ productId: 1, qty: 1 }],
    });
    const deadLetterMessage = await deadLettered;

    assert.equal(deadLetterMessage instanceof Error, false, deadLetterMessage.message);
    assert.equal(attempts, 3);
    assert.equal(deliveries.length, 1);
    assert.equal(deadLetterMessage.properties.headers['x-retry-count'], 2);
    assert.equal(JSON.parse(deadLetterMessage.content.toString()).eventId, published.eventId);
  },
);
