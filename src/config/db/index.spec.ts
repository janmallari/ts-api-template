// create a test case that will test the connection to the database

import DB from './index';
import { describe, it } from 'vitest';

describe('Database connection', () => {
  it('should connect to the database', async () => {
    const db = DB({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    await db.authenticate();
  });
});
