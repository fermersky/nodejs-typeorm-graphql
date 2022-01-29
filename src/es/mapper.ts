import { AuthorHit } from './hit.types';

export const mapAuthorElasticSearchResultToAuthorHits = (hits): AuthorHit[] => {
  return hits.map((hit) => ({
    _type: hit._type,
    _elastic_id: hit._id,
    _score: hit._score,
    _index: hit._index,
    fullName: hit._source.full_name,
    id: hit._source.psql_id,
    addressId: hit._source.addressId,
  }));
};
