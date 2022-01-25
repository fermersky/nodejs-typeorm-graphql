import Address from '../entity/address.entity';
import log from '../util/logger';
import { addressAuthorLoader } from '../data-loaders/address.loader';

export default {
  Query: {
    addresses: async () => {
      const addresses = await Address.find();

      return addresses;
    },

    address: async (parent, args) => {
      const address = await Address.findOne(args.id);

      return address;
    },
  },

  Address: {
    authors: async (parent) => {
      const authors = await addressAuthorLoader.load(parent.id);

      return authors;
    },
  },
};
