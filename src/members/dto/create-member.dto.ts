import { IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  code: string;

  @IsString()
  name: string;
}
