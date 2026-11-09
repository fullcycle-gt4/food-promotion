import { EventEmitter } from 'node:events';
import { FakeChannel } from './FakeChannel.js';

export class FakeConnection extends EventEmitter {
  channels = [];
  closed = false;

  async createConfirmChannel() {
    const channel = new FakeChannel();
    this.channels.push(channel);
    return channel;
  }

  async close() {
    this.closed = true;
    this.emit('close');
  }
}
