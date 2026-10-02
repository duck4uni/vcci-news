/**
 * Shape chung của response phân trang: `{ responseData: { rows: [...] } }`.
 */
export type PagedResult<T> = {
  responseData?: {
    rows?: T[];
  };
};
