import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookCopy } from './book-copy.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  book_id: string;

  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  author: string;

  stock: number;

  @OneToMany(() => BookCopy, (bc) => bc.book)
  copies: BookCopy;
}
