import TestQueue from '@/infrastructure/queues/test.queue';

export const testQueue = new TestQueue();

testQueue.process();
