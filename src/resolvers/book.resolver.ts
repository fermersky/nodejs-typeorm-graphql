import Book from '../entity/book.entity';
import log from '../util/logger';
import { bookAuthorLoader } from '../data-loaders/book.loader';

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
      const bookCreated = await Book.save(book);

      return bookCreated;
    },
  },

  Book: {
    author: async (book) => {
      const author = await bookAuthorLoader.load(book.id);

      return author;
    },
  },
};
