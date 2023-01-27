import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetPaginatedData,
  GetPagination,
} from 'src/common/utils/pagination.util';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookCopy } from './entities/book-copy.entity';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(BookCopy)
    private readonly bookCpyRepo: Repository<BookCopy>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const newbook = await this.bookRepo.save(createBookDto);
      const newBookCpy = await this.bookCpyRepo.save({
        book_id: newbook.book_id,
        status: 'AVAILABLE',
      });

      newbook.stock = 1;

      return newbook;
    } catch (error) {
      throw error;
    }
  }

  async findAll(findDto: FindBookDto) {
    try {
      const { page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const bookQb = this.bookRepo.createQueryBuilder('b');

      const fields = ['book_id', 'code', 'title', 'author', 'created_at'];
      const orders = ['ASC', 'DESC'];

      if (!fields.includes(sort_field)) {
        sort_field = 'created_at';
      }

      if (!orders.includes(sort_order)) {
        sort_order = 'DESC';
      }

      bookQb.take(limit);
      bookQb.skip(offset);

      bookQb.addOrderBy(sort_field, sort_order);

      const results = await bookQb.getManyAndCount();
      const data = GetPaginatedData({
        limit,
        sort_field,
        sort_order,
        count: results[1],
        items: results[0],
        page: isNaN(+page) ? 1 : +page || 1,
      });

      console.log('data', data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
