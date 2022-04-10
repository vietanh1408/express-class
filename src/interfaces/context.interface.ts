import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export type UserAuthPayload = JwtPayload & {
  userId: number;
  role: number;
  tokenVersion: number;
};

export interface Context {
  req: Request;
  res: Response;
  user: UserAuthPayload | null;
}
