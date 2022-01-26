import Book from '../entity/book.entity';
import log from '../util/logger';
import { bookAuthorLoader } from '../data-loaders/book.loader';
import { PubSub } from 'apollo-server-express';

const pubsub = new PubSub();

export default {
  Query: {
    books: async (parent, args) => {
      const books = await Book.find({
        take: 100,
        skip: (args.page - 1) * 100,
      });

      return books;
    },

    book: async (parent, args) => {
      const book = await Book.findOne(args.id);

      return book;
    },

    booksByPublisher: async (parent, args) => {
      const { publisher } = args;

      const books = await Book.find({
        where: { publisher },
      });

      return books;
    },
  },

  Mutation: {
    createBook: async (parent, args) => {
      const book = Book.create(args);
      const newBook = await Book.save(book);

      pubsub.publish('NEW_BOOK_CREATED', { newBook });

      return newBook;
    },
  },

  Book: {
    author: async (book) => {
      const author = await bookAuthorLoader.load(book.id);

      return author;
    },
  },

  Subscription: {
    newBookCreated: {
      resolve: (payload) => {
        return payload.newBook;
      },
      subscribe: (_, args) => {
        console.log('SUBSCRIPTION DATA ', args);
        return pubsub.asyncIterator(['NEW_BOOK_CREATED']);
      },
    },
  },
};
