import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookCopiesDto {
  @IsString()
  @ApiProperty()
  book_id: string;

  @IsNumber()
  @ApiProperty({ type: Number })
  count: number;
}
