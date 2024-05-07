import Redis from 'ioredis';

import { IPublisher } from '@/interfaces/pubsub/publisher';

class RedisPublisher implements IPublisher {
  private _client: Redis;

  constructor() {
    this._client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 0,
    });
  }

  async publish(channel: string, message: string): Promise<void> {
    await this._client.publish(channel, message);
  }
}

export default RedisPublisher;
