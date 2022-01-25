import DataLoader from 'dataloader';
import { In } from 'typeorm';
import Address from '../entity/address.entity';
import Author from '../entity/author.entity';

const batchGetAuthorsByAddressId = async (ids: any[]): Promise<Array<Author[]>> => {
  const addresses = await Address.find({
    where: {
      id: In(ids),
    },
    relations: ['authors'],
  });

  return addresses.map((a) => a.authors);
};

export const addressAuthorLoader = new DataLoader(batchGetAuthorsByAddressId);
