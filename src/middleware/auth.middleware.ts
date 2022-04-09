import { environments } from "../constants";
import { NextFunction } from "express";
import { Secret, verify } from "jsonwebtoken";
import AuthorizationException from "../exceptions/Authorization.exception";
import { Context, UserAuthPayload } from "../interfaces/context.interface";

export const verifyAuth = (context: Context, next: NextFunction) => {
  try {
    const authHeader = context.req.header("Authorization");
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      throw new AuthorizationException();
    }

    const decodedToken = verify(
      accessToken,
      environments.SECRET_TOKEN as Secret
    ) as UserAuthPayload;

    context.user = decodedToken;

    return next();
  } catch (error) {
    new AuthorizationException();
  }
};
