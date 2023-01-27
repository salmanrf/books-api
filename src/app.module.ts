import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { BookBorrowsModule } from './book-borrows/book-borrows.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT,
      type: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: true,
    }),
    BooksModule,
    MembersModule,
    BookBorrowsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
