/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: we need to fix the any types

import { Client } from '@elastic/elasticsearch';

// convert types to Elasticsearch field types
type TypeToElasticsearchFieldType<T> = T extends string
  ? { type: 'text' } | { type: 'keyword' }
  : T extends number
    ? { type: 'long' }
    : T extends Date
      ? { type: 'date' }
      : T extends boolean
        ? { type: 'boolean' }
        : T extends Array<infer U>
          ? TypeToElasticsearchFieldType<U>
          : T extends object
            ? { type: 'nested'; properties: ToElasticsearchMapping<T> }
            : never;

// convert types to Elasticsearch mapping
export type ToElasticsearchMapping<T> = {
  [P in keyof T]: TypeToElasticsearchFieldType<T[P]>;
};

export interface SearchResponse<T> {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number | null;
      _source: T; // Generic type to represent the source document
    }>;
  };
}

export interface ISearchParams {
  page: number;
  limit: number;
  orderBy: string;
  order: 'asc' | 'desc';
  query: any;
}

interface ISearchResponse<T> {
  hits: T[];
  total: number;
}

interface UpdateResponse<T> {
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  result: string;
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
  get?: {
    _source: T;
  };
}

export interface IBaseAggregationResponse {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: any[];
}

abstract class BaseIndex<TDocument> {
  protected _client: Client;
  protected _indexName: string;
  protected _properties: ToElasticsearchMapping<TDocument>;

  constructor(
    name: string,
    client: Client,
    properties: ToElasticsearchMapping<TDocument>
  ) {
    this._indexName = name;
    this._client = client;
    this._properties = properties;

    this.createIndex();
  }

  public get instance(): Client {
    return this._client;
  }

  async createIndex() {
    const exists = await this._client.indices.exists({
      index: this._indexName,
    });

    console.log('Index exists:', exists, this._indexName);

    if (!exists) {
      await this._client.indices.create({
        index: this._indexName,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 1,
          },
          mappings: {
            properties: this._properties,
          },
        },
      });
    }
  }

  abstract generateDocumentId(doc: TDocument): string;

  async createDocument(props: TDocument): Promise<TDocument> {
    // @ts-expect-error id is optional
    const id = props.id;

    await this._client.index({
      index: this._indexName,
      id: id ?? this.generateDocumentId(props),
      document: {
        ...props,
      },
    });

    await this.wait();

    return props;
  }

  async updateDocument(
    id: string,
    props: Partial<TDocument>
  ): Promise<TDocument> {
    const response = await this._client.update<UpdateResponse<TDocument>>({
      index: this._indexName,
      id,
      body: {
        doc: props,
      },
      refresh: 'wait_for',
      _source: true,
    });

    return response.get?._source as TDocument;
  }

  async getDocumentById(documentId: string) {
    const response = await this._client.get({
      index: this._indexName,
      id: documentId,
    });

    return response?._source as TDocument;
  }

  async deleteDocument(documentId: string) {
    const document = await this._client.delete({
      index: this._indexName,
      id: documentId,
    });

    await this.wait();

    return document;
  }
  toDTO(document: any) {
    return { id: document?._id, ...document?._source };
  }

  async searchWithPaginationAndSort(
    query: any = { match_all: {} },
    page: number = 1,
    pageSize: number = 10,
    sortField: string = 'created',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const from = (page - 1) * pageSize;

    return await this._client.search({
      query,
      from,
      size: pageSize,
      sort: [{ [sortField]: sortOrder }],
    });
  }

  async search(
    params: ISearchParams = {
      page: 1,
      limit: 10,
      orderBy: 'created',
      order: 'asc',
      query: { match_all: {} },
    }
  ): Promise<ISearchResponse<TDocument>> {
    const { page, limit, orderBy, order, query } = params;

    const response = await this._client.search<SearchResponse<TDocument>>({
      from: (page - 1) * limit,
      size: limit,
      query,
      sort: [
        {
          [orderBy]: {
            order: order,
          },
        },
      ],
    });

    return {
      hits: response.hits.hits.map((hit) => hit._source as TDocument),
      total: response.hits.total as number,
    };
  }

  /**
   * Elasticsearch refresh interval has a duration of one second.
   * Documents are not reindex within that period, so we set a manual wait.
   */
  async wait() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }

  protected generateWildcardQueryString(
    jsonObject: Record<string, string>
  ): string {
    const wildcardClauses: string[] = [];

    for (const field in jsonObject) {
      if (Object.prototype.hasOwnProperty.call(jsonObject, field)) {
        const value = jsonObject[field];
        // const wildcardClause = `${field}:*${value}*`; // wildcard search
        const wildcardClause = `${field}:"${value}"`;
        wildcardClauses.push(wildcardClause);
      }
    }

    return wildcardClauses.join(' OR ');
  }
}

export default BaseIndex;
