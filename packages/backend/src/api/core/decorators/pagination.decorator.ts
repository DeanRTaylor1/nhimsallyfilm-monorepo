import { createParamDecorator, Action } from "routing-controllers";

export interface Pagination {
  skip: number;
  limit: number;
  sort?: Array<SortItem>;
  search?: Record<string, string>;
}
type SortItem = { field: string; by: "ASC" | "DESC" };
type SearchItem = `${string}:${string}`;

export function GetPagination(options?: { required?: boolean }) {
  return createParamDecorator({
    required: options?.required ?? false,
    value: (action: Action): Pagination => {
      const query = action.request.query;
      const paginationParams: Pagination = {
        skip: parseInt(query.skip?.toString()) || 0,
        limit: parseInt(query.limit?.toString()) || 10,
      };

      if (query.sort) {
        const sortArray = query.sort.toString().split(",");
        paginationParams.sort = sortArray.map((sortItem: string): SortItem => {
          const trimmedItem = sortItem.trim();
          return {
            field: trimmedItem.startsWith("-")
              ? trimmedItem.slice(1)
              : trimmedItem,
            by: trimmedItem.startsWith("-") ? "ASC" : "DESC",
          };
        });
      }

      if (query.search) {
        const searchArray = query.search.toString().split(",");
        paginationParams.search = {};
        searchArray.forEach((searchItem: SearchItem) => {
          const [field, value] = searchItem.split(":");
          if (field && value) {
            paginationParams.search[field.trim()] = value.trim();
          }
        });
      }

      return paginationParams;
    },
  });
}
