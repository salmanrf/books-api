import { BookBorrow } from "src/book-borrows/entities/book-borrow.entity";
import { BOOK_BORROW_STATUS } from "src/common/helpers/book-borrow.helper";
import { AfterLoad, Column, CreateDateColumn, DataSource, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  name: "member_book_borrow_count_view",
  expression: (ds: DataSource) => 
    ds
      .createQueryBuilder()
      .from(BookBorrow, "bb")
      .select("bb.member_id member_id")
      .addSelect("COUNT(bb.book_copy_id)::INTEGER borrow_count")
      .where(`bb.status = '${BOOK_BORROW_STATUS.ONGOING}' AND bb.return_date IS NULL`)
      .groupBy("bb.member_id")
})
export class MemberBookBorrowCountView {
  @ViewColumn()
  member_id: string;

  @ViewColumn()
  borrow_count: number
}

@Entity("members")
export class Member {
  @AfterLoad()
  defaultBorrowCount() {
    if(!this.borrows) {
      this.borrows = {
        borrow_count: 0,
        member_id: this.member_id
      }
    }

    this.borrow_count = this.borrows.borrow_count;

    delete this.borrows;
  }
  
  @PrimaryGeneratedColumn("uuid")
  member_id: string;

  @Column({type: "varchar", length: 10, nullable: false, unique: true})
  code: string;

  @Column({type: "varchar", length: 255, nullable: false})
  name: string;

  @OneToMany(() => BookBorrow, (bc) => bc.member)
  book_borrows: BookBorrow[]
  
  @CreateDateColumn()
  created_at: Date | string;
  
  @UpdateDateColumn()
  updated_at: Date | string;

  @DeleteDateColumn({select: false})
  deleted_at: Date | string;

  borrows: MemberBookBorrowCountView
  
  borrow_count: number;
}
