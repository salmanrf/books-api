import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
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

  findAll() {
    return `This action returns all books`;
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
