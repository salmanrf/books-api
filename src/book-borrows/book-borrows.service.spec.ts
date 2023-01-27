import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowsService } from './book-borrows.service';

describe('BookBorrowsService', () => {
  let service: BookBorrowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookBorrowsService],
    }).compile();

    service = module.get<BookBorrowsService>(BookBorrowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
