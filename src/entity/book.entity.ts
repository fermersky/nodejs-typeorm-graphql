import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Author from './author.entity';

@Entity('book')
export default class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne((type) => Author, (author) => author.books, { nullable: true, onDelete: 'CASCADE' })
  author?: Author;

  @Column({ nullable: true })
  authorId?: string;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  pagesCount: number;

  @Column({ nullable: true })
  publisher: string;
}
