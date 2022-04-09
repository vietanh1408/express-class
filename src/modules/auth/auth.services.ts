import argon2 from "argon2";
import { NextFunction, Response } from "express";
import { LoginInput, RegisterInput } from "interfaces/auth.interface";
import { errorMessages, RoleEnum } from "../../constants";
import { User } from "../user/user.entity";
import HttpException from "../../exceptions/Http.exception";
import ServerErrorException from "../../exceptions/ServerError.exception";
import { createToken } from "../../utils/auth";

export class AuthService {
  public async register(
    input: RegisterInput,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password } = input;

      const exitedUser = await User.findOne({
        where: {
          username,
        },
      });

      if (exitedUser) {
        next(new HttpException(404, errorMessages.exitedUser));
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = User.create({
        username,
        password: hashedPassword,
      });

      await newUser.save();

      const { password: pw, ...rest } = newUser;

      const accessToken = createToken("accessToken", newUser);

      return res.status(200).json({
        success: true,
        user: rest,
        accessToken,
      });
    } catch (error) {
      new ServerErrorException();
    }
  }

  public async login(
    input: LoginInput,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { password, username } = input;

      const user = (await User.findOne({
        where: {
          username,
          role: RoleEnum.Customer,
        },
      })) as User;

      if (!user) {
        next(new HttpException(400, errorMessages.notFoundUser));
      }

      const validPassword = await argon2.verify(user.password, password);

      if (!validPassword) {
        next(new HttpException(400, errorMessages.incorrectPassword));
      }

      const { password: pw, ...rest } = user;

      const accessToken = createToken("accessToken", user);

      return res.status(200).json({
        success: true,
        user: rest,
        accessToken,
      });
    } catch (error) {
      next(new ServerErrorException());
    }
  }

  public async loginAdmin(
    input: LoginInput,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { password, username } = input;

      const user = (await User.findOne({
        where: {
          username,
          role: RoleEnum.Admin,
        },
      })) as User;

      if (!user) {
        next(new HttpException(400, errorMessages.notFoundUser));
      }

      const validPassword = await argon2.verify(user.password, password);

      if (!validPassword) {
        next(new HttpException(400, errorMessages.incorrectPassword));
      }

      const { password: pw, ...rest } = user;

      const accessToken = createToken("accessToken", user);

      return res.status(200).json({
        success: true,
        user: rest,
        accessToken,
      });
    } catch (error) {
      next(new ServerErrorException());
    }
  }
}
