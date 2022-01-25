import DataLoader from 'dataloader';
import { In } from 'typeorm';
import Author from '../entity/author.entity';
import Book from '../entity/book.entity';

const batchGetAuthorOfBookByIds = async (ids: any[]): Promise<Author[]> => {
  const books = await Book.find({
    where: {
      id: In(ids),
    },
    relations: ['author'],
  });

  return books.map((b) => b.author);
};

export const bookAuthorLoader = new DataLoader(batchGetAuthorOfBookByIds);
