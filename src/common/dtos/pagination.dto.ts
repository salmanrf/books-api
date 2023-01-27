import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationRequest {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({ type: Number })
  page: number | string;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ type: Number })
  limit?: number | string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sort_field: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sort_order: 'ASC' | 'DESC';
}

export class PaginatedResponse<T> {
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
  sort_field: string;
  sort_order: string;
  items: T[];
}
