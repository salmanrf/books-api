import { BOOK_COPY_STATUS } from 'src/common/helpers/book.helper';
import {
  Column,
  CreateDateColumn,
  DataSource,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';
import { BookCopy } from './book-copy.entity';

@ViewEntity({
  name: 'book_stock_view',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .from(BookCopy, 'bc')
      .select('bc.book_id')
      .addSelect('COUNT(bc.book_id) stock')
      .where(`bc.status = '${BOOK_COPY_STATUS.AVAILABLE}'`)
      .groupBy('bc.book_id'),
})
export class BookStockView {
  @ViewColumn()
  book_id: string;

  @ViewColumn()
  stock: number;
}

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

  @OneToMany(() => BookCopy, (bc) => bc.book)
  copies: BookCopy;

  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date | string;

  stock: number;
}
