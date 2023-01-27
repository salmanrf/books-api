import { BookCopy } from "src/books/entities/book-copy.entity";
import { BOOK_BORROW_STATUS } from "src/common/helpers/book-borrow.helper";
import { Member } from "src/members/entities/member.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("book_borrows")
export class BookBorrow {
  @PrimaryGeneratedColumn("uuid")
  book_borrow_id: string;

  @Column({type: "uuid", nullable: false})
  book_copy_id: string;
  
  @Column({type: "uuid", nullable: false})
  member_id: string;

  @Column({type: "date", nullable: false, default: new Date()})
  borrow_date: Date | string;

  @Column({type: "date", nullable: true})
  return_date: Date | string;

  @Column({type: "varchar", length: 25, nullable: false, default: BOOK_BORROW_STATUS.ONGOING})
  status: string;

  @ManyToOne(() => Member, (m) => m.book_borrows)
  @JoinColumn({name: "member_id"})
  member: Member;
  
  @ManyToOne(() => BookCopy, (bc) => bc.book_borrows)
  @JoinColumn({name: "book_copy_id"})
  book_copy: BookCopy;

}
