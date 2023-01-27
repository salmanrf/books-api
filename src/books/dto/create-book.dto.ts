import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  author: string;
}
