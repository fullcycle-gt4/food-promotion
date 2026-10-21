export const ORDER_EVENT_TYPES = Object.freeze({
  CREATED: 'order.created',
  STATUS_CHANGED: 'order.status_changed',
});

/**
 * @typedef {{ productId: number, qty: number }} OrderEventItem
 * @typedef {{
 *   eventId: string,
 *   eventType: 'order.created',
 *   occurredAt: string,
 *   data: { id: number, clientId: number, status: 'waiting', items: OrderEventItem[] }
 * } | {
 *   eventId: string,
 *   eventType: 'order.status_changed',
 *   occurredAt: string,
 *   data: {
 *     orderId: number,
 *     clientId: number,
 *     previousStatus: 'waiting' | 'done' | 'canceled',
 *     status: 'waiting' | 'done' | 'canceled'
 *   }
 * }} OrderEvent
 */

const orderStatuses = new Set(['waiting', 'done', 'canceled']);
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isPositiveId = (value) => Number.isInteger(value) && value > 0;

export function assertOrderEventData(eventType, data) {
  if (!isRecord(data)) throw new TypeError('Os dados do evento devem ser um objeto JSON.');

  if (eventType === ORDER_EVENT_TYPES.CREATED) {
    if (
      !isPositiveId(data.id) ||
      !isPositiveId(data.clientId) ||
      data.status !== 'waiting' ||
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      data.items.some(
        (item) =>
          !isRecord(item) ||
          !isPositiveId(item.productId) ||
          !isPositiveId(item.qty),
      )
    )
      throw new TypeError('Dados inválidos para o evento order.created.');
    return;
  }

  if (eventType === ORDER_EVENT_TYPES.STATUS_CHANGED) {
    if (
      !isPositiveId(data.orderId) ||
      !isPositiveId(data.clientId) ||
      !orderStatuses.has(data.previousStatus) ||
      !orderStatuses.has(data.status)
    )
      throw new TypeError('Dados inválidos para o evento order.status_changed.');
    return;
  }

  throw new TypeError(`Tipo de evento não suportado: ${String(eventType)}.`);
}

export function parseOrderEvent(content) {
  let event;
  try {
    event = JSON.parse(content.toString());
  } catch (error) {
    throw new TypeError('O conteúdo da mensagem não contém JSON válido.', { cause: error });
  }

  if (
    !isRecord(event) ||
    typeof event.eventId !== 'string' ||
    !event.eventId ||
    typeof event.occurredAt !== 'string' ||
    Number.isNaN(Date.parse(event.occurredAt))
  )
    throw new TypeError('Envelope do evento inválido.');

  assertOrderEventData(event.eventType, event.data);
  return event;
}
