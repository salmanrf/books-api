import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookBorrowsService } from './book-borrows.service';
import { BookBorrowDto } from './dto/book-borrow.dto';
import { BookReturnDto } from './dto/book-return.dto';

@ApiTags('book-borrows')
@Controller('api/books/borrow')
export class BookBorrowsController {
  constructor(private readonly bookBorrowsService: BookBorrowsService) {}

  @Post()
  async bookBorrow(@Body() bookBorrowDto: BookBorrowDto) {
    try {
      const res = await this.bookBorrowsService.bookBorrow(bookBorrowDto);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/return')
  async bookReturn(@Body() bookReturnDto: BookReturnDto) {
    try {
      const res = await this.bookBorrowsService.bookReturn(bookReturnDto);

      return {
        status: true,
        data: res,
      };
    } catch (error) {
      throw error;
    }
  }
}
