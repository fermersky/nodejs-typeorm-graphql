import AuthorResolver from './author.resolver';
import BookResolver from './book.resolver';
import AddressResolver from './address.resolver';
import SearchResolver from './search.resolver';

export default {
  ...AuthorResolver,
  ...BookResolver,
  ...AddressResolver,
  ...SearchResolver,

  Query: {
    ...AuthorResolver.Query,
    ...BookResolver.Query,
    ...AddressResolver.Query,
    ...SearchResolver.Query,
  },

  Mutation: {
    ...AuthorResolver.Mutation,
    ...BookResolver.Mutation,
  },

  Subscription: {
    ...BookResolver.Subscription,
  },
};
