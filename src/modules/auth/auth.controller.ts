import { NextFunction, Request, Response, Router } from 'express'
import { RequestWithUser } from 'interfaces'
import { LoginInput, RegisterInput } from 'interfaces/auth.interface'
import { Controller } from '../../interfaces/controller.interface'
import { AuthService } from './auth.services'

class AuthController implements Controller {
  public path = '/auth'
  public router = Router()
  public authService = new AuthService()

  constructor() {
    this.mapRoutes()
  }

  private mapRoutes() {
    this.router.post(`${this.path}/register`, this.register)
    this.router.post(`${this.path}/login`, this.login)
    this.router.post(`${this.path}/login_admin`, this.loginAdmin)
    this.router.post('/refresh_token', this.refreshToken)
  }

  private register = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password, email } = req.body as RegisterInput
    return await this.authService.register(
      { username, password, email },
      res,
      next
    )
  }

  private login = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> => {
    const { username, password } = req.body as LoginInput
    return await this.authService.login({ username, password }, res, next)
  }

  private loginAdmin = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> => {
    const { username, password } = req.body as LoginInput
    return await this.authService.loginAdmin({ username, password }, res, next)
  }

  private refreshToken = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    return await this.authService.refreshToken(req, res, next)
  }
}

export default AuthController
