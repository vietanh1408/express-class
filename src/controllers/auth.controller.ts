import { NextFunction, Request, Response, Router } from "express";
import { LoginInput, RegisterInput } from "interfaces/auth.interface";
import { AuthService } from "../services/auth.services";
import { Controller } from "../interfaces/controller.interface";

class AuthController implements Controller {
  public path: string = "/auth";
  public router = Router();
  public authService = new AuthService();

  constructor() {
    this.mapRoutes();
  }

  private mapRoutes() {
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body as RegisterInput;
    return await this.authService.register({ username, password }, res, next);
  };

  private login = async (
    req: Request,
    res: Response
  ): Promise<Response | undefined> => {
    const { username, password } = req.body as LoginInput;
    return await this.authService.login({ username, password }, res);
  };
}

export default AuthController;
