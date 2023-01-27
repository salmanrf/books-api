import {
  BadRequestException,
  ForbiddenException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { BOOK_BORROW_STATUS } from 'src/common/helpers/book-borrow.helper';
import { BOOK_COPY_STATUS } from 'src/common/helpers/book.helper';
import { MEMBER_PENALTY_REASONS } from 'src/common/helpers/member-penalty.helper';
import {
  GetPaginatedData,
  GetPagination,
} from 'src/common/utils/pagination.util';
import { MemberPenaltiesService } from 'src/members/members-penalty.service';
import { MembersService } from 'src/members/members.service';
import { DataSource, Repository } from 'typeorm';
import { BookBorrowDto } from './dto/book-borrow.dto';
import { BookReturnDto } from './dto/book-return.dto';
import { FindBookBorrowsDto } from './dto/find-book-borrow.dto';
import { BookBorrow } from './entities/book-borrow.entity';

@Injectable()
export class BookBorrowsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(BookBorrow)
    private readonly bookBorrowRepo: Repository<BookBorrow>,
    private readonly bookService: BooksService,
    private readonly memberPenaltyService: MemberPenaltiesService,
  ) {}

  async bookBorrow(bookBorrowDto: BookBorrowDto) {
    let queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const { book_id, member_id } = bookBorrowDto;

      // ? Check if member is under penalty
      const penalty = await this.memberPenaltyService.findMemberActivePenalty({
        member_id,
      });

      if (penalty) {
        throw new ForbiddenException(
          `Member is currently under penalty for "${penalty.reason}"`,
        );
      }

      // ? Check if member has borrowed 2 books or more
      if ((await this.getMemberBorrowCount(member_id)) >= 2) {
        throw new BadRequestException("Member can't borrow more than 2 books.");
      }

      // ? Find any available book copy
      const bookCopy = await this.bookService.findOneCopy({
        book_id,
        borrower_id: null,
        status: BOOK_COPY_STATUS.AVAILABLE,
      });

      if (!bookCopy) {
        throw new BadRequestException('Book copy not available.');
      }

      const bookBorrow = await queryRunner.manager.save(BookBorrow, {
        member_id,
        book_copy_id: bookCopy.book_copy_id,
      });

      // ? Update BookCopy to borrowed
      await this.bookService.updateCopy(
        bookCopy.book_copy_id,
        {
          status: BOOK_COPY_STATUS.BORROWED,
          borrower_id: member_id,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return bookBorrow;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async bookReturn(bookReturnDto: BookReturnDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const { book_copy_id, member_id } = bookReturnDto;

      // ? Find book borrow transaction
      const bookBorrow: BookBorrow & { return_date_exceeded: boolean } =
        await this.bookBorrowRepo
          .createQueryBuilder('bb')
          .where({
            book_copy_id,
            member_id,
            status: BOOK_BORROW_STATUS.ONGOING,
          })
          .andWhere('bb.return_date IS NULL')
          .select('*')
          // ? Additional select to determine if current _date is past 7 days since book is borrowed
          .addSelect(
            '(NOW()::DATE - bb.borrow_date)::BOOL return_date_exceeded',
          )
          .getRawOne();

      if (!bookBorrow) {
        throw new NotFoundException('Member is not borrowing this book copy.');
      }

      const { book_borrow_id, return_date_exceeded } = bookBorrow;

      // ? Penalize member for 3 days
      if (return_date_exceeded) {
        const penalty = await this.memberPenaltyService.createMemberPenalty(
          {
            member_id,
            reason: MEMBER_PENALTY_REASONS.BOOK_RETURN_DATE_EXCEEDED,
            day_count: 3,
          },
          queryRunner,
        );
      }

      // ? Update the borrowed book copy to available
      const updatedBookCpy = await this.bookService.updateCopy(book_copy_id, {
        borrower_id: null,
        status: BOOK_COPY_STATUS.AVAILABLE,
      });

      // ? Update the book borrow transaction's return_date
      const updatedBookBorrow = await queryRunner.manager.save(BookBorrow, {
        book_borrow_id,
        status: BOOK_BORROW_STATUS.RETURNED,
        return_date: new Date(),
      });

      await queryRunner.commitTransaction();

      return bookBorrow;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      queryRunner.release();
    }
  }

  async getMemberBorrowCount(member_id: string): Promise<number> {
    try {
      const count = await this.bookBorrowRepo
        .createQueryBuilder('bb')
        .where({ member_id })
        .getCount();

      return count;
    } catch (error) {
      throw error;
    }
  }

  async findMany(findDto: FindBookBorrowsDto) {
    try {
      const { book_id, member_id, page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const bookBorrowQb = this.bookBorrowRepo.createQueryBuilder('bb');

      const fields = ['borrow_date'];
      const orders = ['ASC', 'DESC'];

      if (book_id) {
        bookBorrowQb.andWhere({ book_id });
      }

      if (member_id) {
        bookBorrowQb.andWhere({ member_id });
      }

      if (!fields.includes(sort_field)) {
        sort_field = 'created_at';
      }

      if (!orders.includes(sort_order)) {
        sort_order = 'DESC';
      }

      if (limit != null) {
        bookBorrowQb.take(limit);
      }
      bookBorrowQb.skip(offset);

      bookBorrowQb.addOrderBy('bb.' + sort_field, sort_order);

      const results = await bookBorrowQb.getManyAndCount();
      const data = GetPaginatedData({
        limit,
        sort_field,
        sort_order,
        count: results[1],
        items: results[0],
        page: isNaN(+page) ? 1 : +page || 1,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
