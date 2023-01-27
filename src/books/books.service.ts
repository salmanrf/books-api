import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { BOOK_COPY_STATUS } from 'src/common/helpers/book.helper';
import {
  GetPaginatedData,
  GetPagination,
} from 'src/common/utils/pagination.util';
import { ILike, Repository } from 'typeorm';
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
    private readonly bookCpyRepo: Repository<BookCopy>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const newBook = await this.bookRepo.save(createBookDto);
      const newBookCpy = await this.bookCpyRepo.save({
        book_id: newBook.book_id,
        status: BOOK_COPY_STATUS.AVAILABLE,
      });

      newBook.stock = 1

      return newBook;
    } catch (error) {
      if(error.message.includes("duplicate key value violates unique constraint")) {
        throw new BadRequestException("Duplicate book code.");
      }
      
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
        "b.book_stock",
        BookStockView,
        "bsv",
        "bsv.book_id = b.book_id"
      )

      if(limit != null) {
        bookQb.take(limit);
      }
      bookQb.skip(offset);

      bookQb.addOrderBy("b." + sort_field, sort_order);

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

  async findOne(book_id: string) {
    try {
      const book = await this.bookRepo.findOne({ where: { book_id } });

      if (!book) {
        throw new NotFoundException("Can't find book.");
      }

      return book;
    } catch (error) {
      throw error;
    }
  }

  async update(book_id: string, updateBookDto: UpdateBookDto) {
    try {
      const {author, code, title} = updateBookDto
      const book = await this.bookRepo.findOne({ where: { book_id } });

      if (!book) {
        throw new NotFoundException("Can't find book.");
      }

      if(author != null) {
        book.author = author
      }

      if(code != null) {
        book.code = code
      }
      if(title != null) {
        book.title = title
      }
      
      return this.bookRepo.save(book);
    } catch (error) {
      if(error.message.includes("duplicate key value violates unique constraint")) {
        throw new BadRequestException("Duplicate book code.");
      }

      throw error;
    }
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
