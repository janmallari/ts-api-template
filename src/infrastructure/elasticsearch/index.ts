import { Client } from '@elastic/elasticsearch';

import { config as elasticSearchConfig } from '@/config/elasticsearch';

export type ElasticsearchConfig = {
  node: string;
  username: string;
  password: string;
  ca: string;
  rejectUnauthorized: boolean;
};

class ElasticsearchClient {
  private static _instance: Client;

  constructor() {}

  public static getInstance(): Client {
    if (!ElasticsearchClient._instance) {
      const config = elasticSearchConfig;

      const client = new Client({
        node: config.node,
        auth: {
          username: config.username,
          password: config.password,
        },
        tls: {
          ca: config.ca,
          rejectUnauthorized: config.rejectUnauthorized,
        },
        maxRetries: 10,
        requestTimeout: 60000,
      });

      ElasticsearchClient._instance = client;

      return client;
    }

    return ElasticsearchClient._instance;
  }
}

export default ElasticsearchClient;
