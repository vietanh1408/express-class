import { PagingFilter } from "./common.interface";

export interface CategoryFilter extends PagingFilter {
  keyword?: string;
}

export interface CategoryInput {
  id: string;
  name: string;
  image: string;
  description: string;
}
