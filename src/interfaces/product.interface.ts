import { PagingFilter } from "./common.interface";

export interface ProductFilter extends PagingFilter {
  keyword?: string;
  categoryIds?: string;
}

export interface ProductInput {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  categoryId: string;
}
