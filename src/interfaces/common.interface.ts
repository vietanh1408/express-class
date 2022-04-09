import { DirectionEnum } from "./../constants";
export interface ResponseSuccess {
  success: boolean;
  message?: string;
}

export interface ResponseError {
  success: boolean;
  message?: string;
}

export interface PagingFilter {
  page?: number;
  limit?: number;
  field?: string;
  direction?: DirectionEnum;
}
