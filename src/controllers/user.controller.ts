import { Request, Response } from "express";
import { LoginInput, RegisterInput } from "../interfaces/auth.interface";
import { UserService } from "../services/User.service";
export class UserController {
  public userService = new UserService();

  public async getAllUsers(req: Request, res: Response) {
    console.log("get all user...");
  }

  public async getUserById(req: Request, res: Response) {
    console.log("get user by id...");
  }

  public async register(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { username, password } = req.body as RegisterInput;
    console.log("username: ", username);
    console.log("password: ", password);
    return await this.userService.register({ username, password }, res);
  }

  public async login(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { username, password } = req.body as LoginInput;
    return await this.userService.login({ username, password }, res);
  }
}
