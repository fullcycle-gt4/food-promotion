import { EventEmitter } from 'node:events';

export class FakeChannel extends EventEmitter {
  exchanges = [];
  queues = [];
  bindings = [];
  messages = [];
  acknowledgements = [];
  rejections = [];
  closed = false;

  async assertExchange(...args) {
    this.exchanges.push(args);
  }

  async assertQueue(...args) {
    this.queues.push(args);
  }

  async bindQueue(...args) {
    this.bindings.push(args);
  }

  async prefetch() {}

  ack(message) {
    this.acknowledgements.push(message);
  }

  nack(...args) {
    this.rejections.push(args);
  }

  sendToQueue(queue, body, options) {
    this.messages.push({ queue, body, options });
    return true;
  }

  async waitForConfirms() {}

  async close() {
    this.closed = true;
    this.emit('close');
  }
}
