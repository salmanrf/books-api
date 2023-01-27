import { IsNumber, IsString } from 'class-validator';

export class CreateBookCopiesDto {
  @IsString()
  book_id: string;

  @IsNumber()
  count: number;
}
