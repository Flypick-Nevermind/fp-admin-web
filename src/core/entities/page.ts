/**
 * Generic pagination result shape, owned by the domain layer.
 * Usecases that page through a data source return a `PageResult`,
 * which couples the result set + meta without leaking wire DTOs.
 */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PageResult<T> {
  items: T[];
  meta: PageMeta;
}
