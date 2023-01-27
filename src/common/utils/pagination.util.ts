import { PaginatedResponse } from '../dtos/pagination.dto';

export interface GetPaginatedDataInput<T> {
  count: number;
  page: number;
  limit: number;
  sort_field: string;
  sort_order: string;
  items: T[];
}

export function GetPagination(
  page: number,
  page_size: number,
): { offset: number; limit: number | null } {
  let pageNumber = +page;
  let pageSize = +page_size;

  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }

  if (isNaN(pageSize)) {
    pageSize = null;
  }

  let offset = 0;
  
  if(pageSize != null) {
    offset = pageNumber < 1 ? 0 : (pageNumber - 1) * pageSize;
  }

  return {
    offset,
    limit: pageSize,
  };
}

export function GetPaginatedData<T>(
  input: GetPaginatedDataInput<T>,
): PaginatedResponse<T> {
  const { count, limit, items, sort_field, sort_order, page } = input;

  const total_pages = Math.ceil(count / limit);

  const paginatedData = {
    total_pages,
    sort_field,
    sort_order,
    page,
    limit,
    items,
    total_items: count
  }
  
  if(limit == null) {
    paginatedData.total_pages = 1;
  }
  
  return paginatedData;
}
