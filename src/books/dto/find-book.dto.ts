import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos/pagination.dto';

export class FindBookDto extends PaginationRequest {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  author: string;
}
