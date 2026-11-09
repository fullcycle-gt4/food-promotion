import enums from '../mocks/enums.json';

const toMap = (list) => Object.fromEntries(list.map((i) => [i.value, i.label]));

export const ORDER_STATUS = enums.orderStatus;
export const PAYMENT_METHODS = enums.paymentMethods;
export const DELIVERY_METHODS = enums.deliveryMethods;

export const statusLabel = toMap(ORDER_STATUS);
export const paymentLabel = toMap(PAYMENT_METHODS);
export const deliveryLabel = toMap(DELIVERY_METHODS);

export const statusTone = { waiting: 'orange', done: 'green', canceled: 'red' };
