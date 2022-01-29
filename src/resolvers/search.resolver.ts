import ESClient from '../es/es-client';
import { mapAuthorElasticSearchResultToAuthorHits } from '../es/mapper';

export default {
  Query: {
    search: (parent, args) => {
      return args;
    },
  },

  SearchResult: {
    authors: async (parent, args) => {
      const result = await ESClient.search({
        index: 'authors',
        body: {
          query: {
            multi_match: {
              query: args.fullName.toLowerCase(),
              type: 'bool_prefix',
              fields: ['full_name', 'full_name._2gram', 'full_name._3gram'],
            },
          },
        },
      });

      return mapAuthorElasticSearchResultToAuthorHits(result.body.hits.hits);
    },
  },
};
