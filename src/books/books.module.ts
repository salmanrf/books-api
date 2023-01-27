import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookCopy } from './entities/book-copy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookCopy])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService]
})
export class BooksModule {}
