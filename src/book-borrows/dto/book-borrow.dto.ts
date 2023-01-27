import { IsString } from "class-validator";

export class BookBorrowDto {
  @IsString()
  book_id: string;

  @IsString()
  member_id: string;
}
