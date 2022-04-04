import { Request, Response, Router } from "express";
import { LoginInput, RegisterInput } from "interfaces/auth.interface";
import { Controller } from "../interfaces/controller.interface";
import { UserService } from "../services/User.service";

class AuthController implements Controller {
  public path: string = "/api";
  public router = Router();
  public userService = new UserService();

  constructor() {
    this.mapRoutes();
  }

  private mapRoutes() {
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
  }

  private register = async (
    req: Request,
    res: Response
  ): Promise<Response | undefined> => {
    const { username, password } = req.body as RegisterInput;
    return await this.userService.register({ username, password }, res);
  };

  private login = async (
    req: Request,
    res: Response
  ): Promise<Response | undefined> => {
    const { username, password } = req.body as LoginInput;
    return await this.userService.login({ username, password }, res);
  };
}

export default AuthController;
