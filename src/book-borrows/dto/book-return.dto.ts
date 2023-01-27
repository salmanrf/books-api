import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BookReturnDto {
  @IsString()
  @ApiProperty({ description: 'The id if the book copy being borrowed.' })
  book_copy_id: string;

  @IsString()
  @ApiProperty({
    description: 'The id if the member borrowing the book copy..',
  })
  member_id: string;
}
