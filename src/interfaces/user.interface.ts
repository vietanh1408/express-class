import { PagingFilter } from "./common.interface";

export interface UserFilter extends PagingFilter {
  keyword?: string;
}
