import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_copies')
export class BookCopy {
  @PrimaryGeneratedColumn('uuid')
  book_copy_id: string;

  @Column({ type: 'uuid', nullable: false })
  book_id: string;

  @Column({ type: 'uuid', nullable: true })
  borrower_id: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
    default: 'AVAILABLE',
  })
  status: string;

  @ManyToOne(() => Book, (b) => b.book_id)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}