import type bull from 'bull';

import BaseQueue from '@/infrastructure/queues/base';

export default class PushNotificationSenderQueue extends BaseQueue {
  constructor() {
    // Queue name
    super('test-queue');
  }

  async callback(job: bull.Job, done: bull.DoneCallback) {
    // do something

    // Call done when finished
    done();
  }
}
