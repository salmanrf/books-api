import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { BOOK_COPY_STATUS } from 'src/common/helpers/book.helper';
import {
  GetPaginatedData,
  GetPagination,
} from 'src/common/utils/pagination.util';
import { ILike, QueryResult, QueryRunner, Repository } from 'typeorm';
import { CreateBookCopiesDto } from './dto/create-book-copies.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookCopy } from './entities/book-copy.entity';
import { Book, BookStockView } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(BookCopy)
    private readonly bookCopyRepo: Repository<BookCopy>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const newBook = await this.bookRepo.save(createBookDto);
      const newBookCpy = await this.bookCopyRepo.save({
        book_id: newBook.book_id,
        status: BOOK_COPY_STATUS.AVAILABLE,
      });

      newBook.stock = 1;

      return newBook;
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new BadRequestException('Duplicate book code.');
      }

      throw error;
    }
  }

  async createCopies(createCopiesDto: CreateBookCopiesDto) {
    try {
      const { book_id, count } = createCopiesDto;
      const bookQb = this.bookRepo.createQueryBuilder('b');

      bookQb.where({
        book_id,
      });

      const book = await bookQb.getOne();

      if (!book) {
        throw new NotFoundException("Can't find book.");
      }

      const createValues = Array(count)
        .fill(null)
        .map(() => ({
          book_id,
          status: BOOK_COPY_STATUS.AVAILABLE,
        }));

      await this.bookCopyRepo
        .createQueryBuilder('bc')
        .insert()
        .values(createValues)
        .execute();

      return await this.bookRepo
        .createQueryBuilder('b')
        .where({ book_id })
        .leftJoinAndMapOne(
          'b.book_stock',
          BookStockView,
          'bsv',
          'bsv.book_id = b.book_id',
        )
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findMany(findDto: FindBookDto) {
    try {
      const { author, code, title, page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const bookQb = this.bookRepo.createQueryBuilder('b');

      const fields = ['book_id', 'code', 'title', 'author', 'created_at'];
      const orders = ['ASC', 'DESC'];

      if (author) {
        bookQb.andWhere({ author: ILike('%:author%') }, { author });
      }

      if (code) {
        bookQb.andWhere({ code: ILike('%:code%') }, { code });
      }

      if (title) {
        bookQb.andWhere({ title: ILike('%:title%') }, { title });
      }

      if (!fields.includes(sort_field)) {
        sort_field = 'created_at';
      }

      if (!orders.includes(sort_order)) {
        sort_order = 'DESC';
      }

      bookQb.leftJoinAndMapOne(
        'b.book_stock',
        BookStockView,
        'bsv',
        'bsv.book_id = b.book_id',
      );

      if (limit != null) {
        bookQb.take(limit);
      }
      bookQb.skip(offset);

      bookQb.addOrderBy('b.' + sort_field, sort_order);

      const results = await bookQb.getManyAndCount();
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

  async findOne(
    book_id: string,
    crit?: { stock_available: boolean } & Partial<Book>,
  ) {
    try {
      const {
        stock_available,
        stock,
        book_stock,
        copies,
        defaultBookStock,
        ...criteria
      } = crit ?? {};
      const bookQb = this.bookRepo.createQueryBuilder('b');

      bookQb.where({
        book_id,
        ...criteria,
      });

      if (stock_available) {
        bookQb.innerJoin(
          'b.copies',
          'bc',
          'status = :status_available AND borrower_id IS NULL',
          { status_available: BOOK_COPY_STATUS.AVAILABLE },
        );
      }

      const book = await bookQb.getOne();

      if (!book) {
        throw new NotFoundException("Can't find book.");
      }

      return book;
    } catch (error) {
      throw error;
    }
  }

  async findOneCopy(crit: Partial<BookCopy>) {
    try {
      const { book, book_borrows, ...criteria } = crit;
      const bookCopy = await this.bookCopyRepo.findOne({
        where: { ...criteria },
      });

      return bookCopy;
    } catch (error) {
      throw error;
    }
  }

  async update(book_id: string, updateBookDto: UpdateBookDto) {
    try {
      const { author, code, title } = updateBookDto;
      const book = await this.bookRepo.findOne({ where: { book_id } });

      if (!book) {
        throw new NotFoundException("Can't find book.");
      }

      if (author != null) {
        book.author = author;
      }

      if (code != null) {
        book.code = code;
      }
      if (title != null) {
        book.title = title;
      }

      return this.bookRepo.save(book);
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new BadRequestException('Duplicate book code.');
      }

      throw error;
    }
  }

  async updateCopy(
    book_copy_id: string,
    parameters: Partial<BookCopy>,
    qr?: QueryRunner,
  ) {
    if (qr) {
      return qr.manager.save(BookCopy, {
        book_copy_id,
        ...parameters,
      });
    }

    return this.bookCopyRepo.save({ book_copy_id, ...parameters });
  }

  async delete(book_id: string) {
    try {
      const book = await this.bookRepo.findOne({ where: { book_id } });

      if (!book) {
        throw new NotFoundException("Can't find book.");
      }

      await this.bookRepo.softDelete({ book_id });

      return book;
    } catch (error) {
      throw error;
    }
  }
}
