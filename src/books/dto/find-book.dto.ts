import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos/pagination.dto';

export class FindBookDto extends PaginationRequest {
  @IsString()
  @IsOptional()
  @ApiProperty()
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  author: string;
}
