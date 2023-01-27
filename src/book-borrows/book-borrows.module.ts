import { Module } from '@nestjs/common';
import { BookBorrowsService } from './book-borrows.service';
import { BookBorrowsController } from './book-borrows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookBorrow } from './entities/book-borrow.entity';
import { BooksModule } from 'src/books/books.module';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookBorrow]),
    BooksModule,
    MembersModule
  ],
  controllers: [BookBorrowsController],
  providers: [BookBorrowsService]
})
export class BookBorrowsModule {}
