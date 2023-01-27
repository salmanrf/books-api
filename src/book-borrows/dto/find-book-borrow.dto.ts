import { IsOptional, IsString } from "class-validator";
import { PaginationRequest } from "src/common/dtos/pagination.dto";

export class FindBookBorrowsDto extends PaginationRequest {
  @IsString()
  @IsOptional()
  book_id?: string;

  @IsString()
  @IsOptional()
  member_id?: string;
}