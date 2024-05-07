import fs from 'fs';
import { ElasticsearchConfig } from '@/infrastructure/elasticsearch';

const ca = fs.readFileSync(process.env.ELASTICSEARCH_CA as string, 'utf-8');

export const config: ElasticsearchConfig = {
  node: process.env.ELASTICSEARCH_NODE as string,
  username: process.env.ELASTICSEARCH_USERNAME as string,
  password: process.env.ELASTICSEARCH_PASSWORD as string,
  rejectUnauthorized: true,
  ca,
};
