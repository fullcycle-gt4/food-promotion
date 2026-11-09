import { parseOrderEvent } from './events.js';
import {
  DEFAULT_QUEUE_NAMES,
  MAX_RETRY_ATTEMPTS,
  MAX_RETRY_DELAY_MS,
  BASE_RETRY_DELAY_MS,
} from './queueConfig.js';

const getRetryCount = (message) => {
  const retryCount = message.properties.headers?.['x-retry-count'] ?? 0;
  if (!Number.isInteger(retryCount) || retryCount < 0) return MAX_RETRY_ATTEMPTS;
  return retryCount;
};

const retryDelay = (retryCount, baseDelayMs) =>
  Math.min(baseDelayMs * 2 ** (retryCount - 1), MAX_RETRY_DELAY_MS);

export function createOrderEventHandler({
  channel,
  processEvent = async (event, logger) => {
    logger.log(
      JSON.stringify({
        level: 'info',
        message: 'Evento de pedido consumido.',
        eventId: event.eventId,
        eventType: event.eventType,
        orderId: event.data.orderId ?? event.data.id,
      }),
    );
  },
  logger = console,
  queueNames = DEFAULT_QUEUE_NAMES,
  maxRetries = MAX_RETRY_ATTEMPTS,
  baseDelayMs = BASE_RETRY_DELAY_MS,
}) {
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > queueNames.retries.length)
    throw new RangeError('O limite de retentativas não corresponde às filas configuradas.');
  if (!Number.isInteger(baseDelayMs) || baseDelayMs < 1)
    throw new RangeError('O intervalo base de retentativa deve ser um inteiro positivo.');

  return async (message) => {
    if (!message) return;

    let event;
    try {
      event = parseOrderEvent(message.content);
    } catch (error) {
      logger.error('Mensagem permanentemente inválida encaminhada à DLQ.', error);
      channel.nack(message, false, false);
      return;
    }

    try {
      await processEvent(event, logger);
      channel.ack(message);
    } catch (error) {
      logger.error('Falha temporária ao processar o evento.', error);
      const retryCount = getRetryCount(message);

      if (retryCount >= maxRetries) {
        logger.error(`Limite de ${maxRetries} retentativas atingido; encaminhando à DLQ.`);
        channel.nack(message, false, false);
        return;
      }

      const nextRetryCount = retryCount + 1;
      const retryQueue = queueNames.retries[nextRetryCount - 1];
      if (!retryQueue) {
        logger.error('Fila de retentativa não configurada; encaminhando à DLQ.');
        channel.nack(message, false, false);
        return;
      }

      try {
        const retryMessage = channel.sendToQueue(
          retryQueue.name,
          message.content,
          {
            ...message.properties,
            persistent: true,
            headers: {
              ...message.properties.headers,
              'x-retry-count': nextRetryCount,
              'x-retry-delay-ms': retryDelay(nextRetryCount, baseDelayMs),
            },
          },
        );
        if (!retryMessage) await new Promise((resolve) => channel.once('drain', resolve));
        await channel.waitForConfirms();
        channel.ack(message);
      } catch (publishError) {
        logger.error('Falha ao agendar retentativa; reencaminhando mensagem para a fila.', publishError);
        channel.nack(message, false, true);
      }
    }
  };
}
