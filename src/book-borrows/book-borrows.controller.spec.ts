import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowsController } from './book-borrows.controller';
import { BookBorrowsService } from './book-borrows.service';

describe('BookBorrowsController', () => {
  let controller: BookBorrowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookBorrowsController],
      providers: [BookBorrowsService],
    }).compile();

    controller = module.get<BookBorrowsController>(BookBorrowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
