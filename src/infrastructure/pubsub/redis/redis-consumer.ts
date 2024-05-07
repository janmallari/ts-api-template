import Redis from 'ioredis';

import { IConsumer } from '@/interfaces/pubsub/consumer';

abstract class RedisConsumer implements IConsumer {
  private _client: Redis;
  private _channels: string[] = [];

  constructor(channels: string[] = []) {
    this._client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 0,
    });

    this._channels = channels;

    this._client.on('connect', () => {
      this.subscribe().catch((err) =>
        console.error('Subscription error:', err)
      );
    });
  }

  async subscribe(): Promise<void> {
    if (this._client.status !== 'connect') {
      console.log('Waiting for Redis subscriber client connection...');
      return; // Exit if not connected, rely on the connect event to retry
    }

    console.log('Subscribing to Redis channels:', this._channels);
    await this._client.subscribe(...this._channels);
    this._client.on('message', (ch, msg) => {
      this.processMessage.bind(this)(ch, msg);
    });
  }

  abstract processMessage(channel: string, message: string): void;

  async unsubscribe(channel: string): Promise<void> {
    await this._client.unsubscribe(channel);
  }
}

export default RedisConsumer;
