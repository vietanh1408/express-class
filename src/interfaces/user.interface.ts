import { RoleEnum } from "../constants";
import { PagingFilter } from "./common.interface";

export interface UserFilter extends PagingFilter {
  keyword?: string;
  role?: RoleEnum;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
  role: RoleEnum;
}
