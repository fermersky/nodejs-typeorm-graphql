import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Address from './address.entity';
import Book from './book.entity';

@Entity('author')
export default class Author extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', name: 'first_name', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', nullable: true })
  lastName: string;

  @OneToMany((type) => Book, (book) => book.author, { nullable: true })
  books?: Book[];

  @ManyToOne((type) => Address, (address) => address.authors, { nullable: true })
  address?: Address;

  @Column()
  addressId: string;
}
