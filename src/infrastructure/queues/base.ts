import bull from 'bull';

import redisConfig from '@/config/redis';

export default abstract class BaseQueue {
  protected _queue: bull.Queue;

  constructor(queueName: string) {
    this._queue = new bull(queueName, {
      redis: {
        port: redisConfig.port,
        host: redisConfig.host,
        password: redisConfig.password,
        retryStrategy(times) {
          return Math.min(times * 50, 2000);
        },
      },
    });

    // check if the queue is ready
    this._queue.on('ready', () => {
      console.log(`[${queueName}] Queue is ready`);
    });
  }

  /**
   * Add a job to the queue
   * @param data - The job data to add
   */
  async add(data: object, options?: bull.JobOptions) {
    await this._queue.add(data, options);
  }

  /**
   * Process the queue
   */
  process() {
    this._queue.process(this.callback);
  }

  // get all jobs
  async getJobs() {
    return await this._queue.getJobs(['waiting', 'active']);
  }

  /**
   * The callback to execute
   * @param job - The job to process
   */
  abstract callback(job: bull.Job, done: bull.DoneCallback): void;
}
