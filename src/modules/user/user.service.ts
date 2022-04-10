import { NextFunction, Request, Response } from "express";
import { UserCreateInput, UserFilter } from "interfaces/user.interface";
import { UserRepository } from "./user.repository";
import { errorMessages } from "../../constants";
import { User } from "../../entities/user.entity";
import HttpException from "../../exceptions/Http.exception";
import ServerErrorException from "../../exceptions/ServerError.exception";
import argon2 from "argon2";

export class UserService {
  private userRepo = new UserRepository();

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = req.query as UserFilter;

      const [users, total] = await this.userRepo.getAll(filter);

      const userWithoutPassword = users.map((user) => {
        const { password, ...rest } = user;
        return rest;
      });

      return res.status(200).json({
        success: true,
        users: userWithoutPassword,
        total,
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

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username, role } = req.body as UserCreateInput;

      const existedUsers = await this.userRepo.getAll({
        keyword: username,
      });

      if (existedUsers[1] > 0) {
        next(new HttpException(404, errorMessages.exitedUser));
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = User.create({
        username,
        email,
        role,
        password: hashedPassword,
      });

      await newUser.save();

      const { password: pw, ...rest } = newUser;

      return res.status(301).json({
        success: true,
        user: rest,
      });
    } catch (err) {
      next(new ServerErrorException());
    }
  }
}
