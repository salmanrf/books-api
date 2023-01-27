import { BOOK_COPY_STATUS } from 'src/common/helpers/book.helper';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DataSource,
  DeleteDateColumn,
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
      .select('bc.book_id book_id')
      .addSelect('COUNT(bc.book_id)::INTEGER stock')
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
  @AfterLoad()
  defaultBookStock() {
    if(!this.book_stock) {
      this.book_stock = {
        book_id: this.book_id,
        stock: 0
      }
    }
  }
  
  @PrimaryGeneratedColumn('uuid')
  book_id: string;

  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  author: string;

  @OneToMany(() => BookCopy, (bc) => bc.book, {cascade: ["remove"]})
  copies: BookCopy;

  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date | string
  
  @DeleteDateColumn({select: false})
  deleted_at: Date | string;

  book_stock: BookStockView
  
  stock: number;
}
