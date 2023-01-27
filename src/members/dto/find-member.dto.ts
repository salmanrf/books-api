import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos/pagination.dto';

export class FindMemberDto extends PaginationRequest {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  name: string;
}
