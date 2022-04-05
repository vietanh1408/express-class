import argon2 from "argon2";
import { NextFunction, Response } from "express";
import { createToken } from "../utils/auth";
import { errorMessages } from "../constants/errorMessages";
import { User } from "../entities/User.entity";
import HttpException from "../exceptions/Http.exception";
import ServerErrorException from "../exceptions/ServerError.exception";
import {
  LoginInput,
  RegisterInput,
  RegisterResponse,
} from "../interfaces/auth.interface";
import { UserFilter } from "interfaces/user.interface";

export class UserService {
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
    res: Response
  ): Promise<Response | undefined> {
    try {
      const { password, username } = input;

      const user = (await User.findOne({
        where: {
          username,
        },
      })) as User;

      if (!user) {
        new HttpException(400, errorMessages.notFoundUser);
      }

      const validPassword = await argon2.verify(user.password, password);

      if (!validPassword) {
        new HttpException(400, errorMessages.incorrectPassword);
      }

      const { password: pw, ...rest } = user;

      const accessToken = createToken("accessToken", user);

      return res.status(200).json({
        success: true,
        user: rest,
        accessToken,
      });
    } catch (error) {
      new ServerErrorException();
    }
  }

  public async getAll(filter: UserFilter, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      const userWithoutPassword = users.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });

      return res.status(200).json({
        success: true,
        users: userWithoutPassword,
      });
    } catch (error) {
      next(new ServerErrorException());
    }
  }

  public async getOne(id: string, res: Response, next: NextFunction) {
    try {
      const user = await User.findOneBy({
        id,
      });

      if (!user) {
        next(new HttpException(404, errorMessages.notFoundUser));
      }

      const { password, ...rest } = user as User;

      return res.status(200).json({
        success: true,
        user: rest,
      });
    } catch (error) {
      next(new ServerErrorException());
    }
  }
}
