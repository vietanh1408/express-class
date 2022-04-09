import { NextFunction, Request, Response } from "express";
import { UserFilter } from "interfaces/user.interface";
import { UserRepository } from "../repositories/User.repository";
import { errorMessages } from "../constants";
import { User } from "../modules/user/user.entity";
import HttpException from "../exceptions/Http.exception";
import ServerErrorException from "../exceptions/ServerError.exception";

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
}
