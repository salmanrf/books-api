import { IsString } from "class-validator";

export class BookReturnDto {
  @IsString()
  book_copy_id: string;

  @IsString()
  member_id: string;
}
