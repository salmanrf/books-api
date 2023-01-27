import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BookBorrowDto {
  @IsString()
  @ApiProperty({ description: 'The id of the book to borrow.' })
  book_id: string;

  @IsString()
  @ApiProperty({ description: 'The id of the member borrowing the book.' })
  member_id: string;
}
