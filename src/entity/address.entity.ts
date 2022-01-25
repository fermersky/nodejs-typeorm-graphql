import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Author from './author.entity';

@Entity()
export default class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  house?: string;

  @OneToMany((type) => Author, (author) => author.address, { nullable: true })
  authors?: Author[];
}
