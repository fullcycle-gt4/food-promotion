export const DEFAULT_QUEUE_PREFIX = 'orders.events';
export const MAX_RETRY_ATTEMPTS = 5;
export const BASE_RETRY_DELAY_MS = 1000;
export const MAX_RETRY_DELAY_MS = 30_000;

export function createQueueNames(
  prefix = DEFAULT_QUEUE_PREFIX,
  maxRetries = MAX_RETRY_ATTEMPTS,
  { baseDelayMs = BASE_RETRY_DELAY_MS } = {},
) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(prefix))
    throw new TypeError('O prefixo das filas contém caracteres inválidos.');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 20)
    throw new RangeError('O limite de retentativas deve estar entre 0 e 20.');
  if (!Number.isInteger(baseDelayMs) || baseDelayMs < 1)
    throw new RangeError('O intervalo base de retentativa deve ser um inteiro positivo.');

  return Object.freeze({
    main: prefix,
    deadLetterExchange: `${prefix}.dlx`,
    deadLetter: `${prefix}.dead-letter`,
    deadLetterRoutingKey: `${prefix}.dead-letter`,
    retries: Array.from({ length: maxRetries }, (_, index) => ({
      name: `${prefix}.retry.${index + 1}`,
      delayMs: Math.min(baseDelayMs * 2 ** index, MAX_RETRY_DELAY_MS),
    })),
  });
}

export const DEFAULT_QUEUE_NAMES = createQueueNames();
export const ORDERS_QUEUE = DEFAULT_QUEUE_NAMES.main;
export const DEAD_LETTER_EXCHANGE = DEFAULT_QUEUE_NAMES.deadLetterExchange;
export const DEAD_LETTER_QUEUE = DEFAULT_QUEUE_NAMES.deadLetter;
export const DEAD_LETTER_ROUTING_KEY = DEFAULT_QUEUE_NAMES.deadLetterRoutingKey;
