import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookCopiesDto } from './dto/create-book-copies.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books')
@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    try {
      const res = await this.booksService.create(createBookDto);

      return {
        status: true,
        data: res,
        message: 'Created Successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/copies')
  async createCopies(@Body() createCopiesDto: CreateBookCopiesDto) {
    try {
      const res = await this.booksService.createCopies(createCopiesDto);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findMany(@Query() findDto: FindBookDto) {
    try {
      const res = await this.booksService.findMany(findDto);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':book_id')
  async findOne(@Param('book_id') book_id: string) {
    try {
      const res = await this.booksService.findOne(book_id);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':book_id')
  async update(
    @Param('book_id') book_id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    try {
      const res = await this.booksService.update(book_id, updateBookDto);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':book_id')
  async remove(@Param('book_id') book_id: string) {
    try {
      const res = await this.booksService.delete(book_id);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }
}
