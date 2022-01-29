import { Client } from '@elastic/elasticsearch';
import Author from '../entity/author.entity';

interface IESClientInitialConfig {
  recreateIndexes?: string[];
}

// es stands for elasticsearch
export default class ESClient {
  static client: any;

  static async init(config: IESClientInitialConfig) {
    try {
      ESClient.client = new Client({
        node: 'http://127.0.0.1:9200/',
        auth: {
          username: 'elastic',
          password: 'pwd',
        },
      });

      await ESClient.ping();

      console.log('🔍 elasticsearch client connection established');

      if (config?.recreateIndexes) {
        await ESClient.recreatedIndexes(config.recreateIndexes);
      }
    } catch (er) {
      console.log('❌ elasticsearch client connection error: ', er);
      throw er;
    }
  }

  private static async recreatedIndexes(indexes) {
    if (indexes.length === 0) {
      return;
    }

    if (indexes.includes('authors')) {
      await ESClient.recreateAuthorIndex();
    }
  }

  private static async recreateAuthorIndex() {
    // drop authors index
    await ESClient.client.indices.delete({ index: 'authors' });

    console.log('elasticsearch > author index was dropped');

    // create authors index and attach mapping types
    await ESClient.client.indices.create({ index: 'authors' });
    await ESClient.client.indices.putMapping({
      index: 'authors',
      type: '_doc',
      include_type_name: true,
      body: {
        properties: {
          full_name: {
            type: 'search_as_you_type', // type for autosuggestions
          },
          psql_id: {
            type: 'long',
          },
          addressId: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256,
              },
            },
          },
        },
      },
    });

    console.log('elasticserach > authors index was created');
  }

  static async indexAuthor(author: Author) {
    try {
      await ESClient.client.index({
        index: 'authors',
        body: {
          psql_id: author.id,
          full_name: `${author.firstName} ${author.lastName}`,
          address: author.address,
          addressId: author.addressId,
        },
      });
    } catch (er) {
      console.log('elasticsearch | index operation error ', er);
    }
  }

  static async deleteAuthor(id: string) {
    await ESClient.client.deleteByQuery({
      index: 'authors',
      body: {
        query: {
          match: {
            psql_id: id,
          },
        },
      },
    });
  }

  static async ping() {
    return await ESClient.client.ping();
  }

  static async search(query) {
    return await ESClient.client.search(query);
  }

  static async indices() {
    const indicies = await ESClient.client.cat.indices({ v: true });
    return indicies;
  }
}
