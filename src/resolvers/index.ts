import AuthorResolver from './author.resolver';
import BookResolver from './book.resolver';
import AddressResolver from './address.resolver';

export default {
  ...AuthorResolver,
  ...BookResolver,
  ...AddressResolver,

  Query: {
    ...AuthorResolver.Query,
    ...BookResolver.Query,
    ...AddressResolver.Query,
  },

  Mutation: {
    ...AuthorResolver.Mutation,
    ...BookResolver.Mutation,
  },
};
