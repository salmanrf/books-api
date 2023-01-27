import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  name: string;
}
