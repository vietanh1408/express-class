import { Secret, sign } from "jsonwebtoken";
import { User } from "../entities/user.entity";

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
      expiresIn: type === "accessToken" ? "30s" : "10h",
    }
  );
};
