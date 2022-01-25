import { In } from 'typeorm';
import Author from '../entity/author.entity';
import Book from '../entity/book.entity';
import Address from '../entity/address.entity';
import log from '../util/logger';
import DataLoader from 'dataloader';

// DataLoader is used to create a data loader. DataLoader is constructed using a batch loading function.
// A batch loading function accepts an array of keys, and returns a promise which resolves to an array of values.
// Use the resulting data loader function to load values. DataLoader will coalesce all individual loads which
// occur within a single tick of an event loop and then call your batch loading function.

// IMPORTANT: works good if root query result is not too big (about 100 items)
//            for big amount of data (10k items and more) api response is extremely slow

// batch loader function
// param and return data are both should be arrays with equal length
const batchGetBooksByAuthorId = async (ids: any[]): Promise<Array<Book[]>> => {
  const authors = await Author.find({
    where: {
      id: In(ids),
    },
    relations: ['books'],
  });

  return authors.map((a) => a.books);
};

const batchGetAddressByAuthorId = async (ids: any[]): Promise<Array<Address>> => {
  const authors = await Author.find({
    where: {
      id: In(ids),
    },
    relations: ['address'],
  });

  return authors.map((a) => a.address);
};

export const authorBooksLoader = new DataLoader(batchGetBooksByAuthorId);
export const authorAddressLoader = new DataLoader(batchGetAddressByAuthorId);
