import { User } from "../entities/user.entity";
import { Secret, sign } from "jsonwebtoken";

export const createToken = (
  type: "accessToken" | "refreshToken",
  user: User
): string => {
  return sign(
    { userId: user.id, role: user.role },
    type === "accessToken"
      ? (process.env.SECRET_TOKEN as Secret)
      : (process.env.REFRESH_TOKEN as Secret),
    {
      expiresIn: type === "accessToken" ? "5m" : "60m",
    }
  );
};
