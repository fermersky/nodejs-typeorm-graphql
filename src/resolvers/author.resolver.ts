import Author from '../entity/author.entity';
import log from '../util/logger';
import { plainToInstance } from 'class-transformer';
import { authorAddressLoader, authorBooksLoader } from '../data-loaders/author.loader';
import { PubSub } from 'apollo-server-express';

const pubsub = new PubSub();

export default {
  Query: {
    authors: async (parent, args, req, info) => {
      const authors = await Author.find({
        take: 100,
        skip: (args.page - 1) * 100,
      });

      return authors;
    },

    author: async (_, args) => {
      const author = await Author.findOne(args.id);

      return author;
    },

    authorsByName: async (_, args) => {
      const { pattern } = args;
      const authorsRaw = await Author.query(
        `
        select a.*, first_name as "firstName", last_name as "lastName" from author a
        where concat(a.first_name, ' ', a.last_name) like $1
       `,
        [pattern]
      );

      const authors = authorsRaw.map((a) => plainToInstance(Author, a));

      return authors;
    },
  },

  Mutation: {
    createAuthor: async (parent, args) => {
      const author = Author.create(args);
      const newAuthor = await Author.save(author);

      return newAuthor;
    },
  },

  Author: {
    // nested resolvers works, but they produce n+1 problem
    // for every author, will be 2 extra query to get books and address
    // if result contains 2000 authors, api will make 2000 + 2000 + 1 queries

    // we will always make 1 initial query to the DB and return N results,
    // which means we will have to make N additional DB queries. (N + 1)

    // books: async (parent, args, req, info) => {
    //   log.info('Author resolver, Author sub-resolver, books query');
    //   const books = await Book.find({
    //     where: {
    //       author: {
    //         id: parent.id,
    //       },
    //     },
    //   });
    //   return books;
    // },

    books: async (parent, args, req, info) => {
      const books = await authorBooksLoader.load(parent.id);

      return books;
    },

    address: async (parent, args) => {
      const address = await authorAddressLoader.load(parent.id);

      return address;
    },
  },
};
