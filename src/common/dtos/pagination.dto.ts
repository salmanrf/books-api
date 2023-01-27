import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationRequest {
  @IsNumberString()
  @IsOptional()
  page: number | string;

  @IsNumberString()
  @IsOptional()
  limit?: number | string | null;

  @IsString()
  @IsOptional()
  sort_field: string;

  @IsString()
  @IsOptional()
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
