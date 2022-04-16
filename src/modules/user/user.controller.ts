import { NextFunction, Request, Response, Router } from 'express'
import { Controller } from '../../interfaces/controller.interface'
import { UserService } from './user.service'

class UserController implements Controller {
  public path = '/users'
  public router = Router()
  public userService = new UserService()

  constructor() {
    this.mapRoutes()
  }

  private mapRoutes() {
    this.router.get(this.path, this.getAll)
    this.router.get(`${this.path}/:id`, this.getOne)
    this.router.post(`${this.path}`, this.create)
    this.router.put(`${this.path}`, this.update)
    this.router.delete(`${this.path}/:id`, this.delete)
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    return await this.userService.getAll(req, res, next)
  }

  public getOne = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    return await this.userService.getOne(id, res, next)
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    return await this.userService.create(req, res, next)
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    return await this.userService.update(req, res, next)
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    return await this.userService.delete(id, res, next)
  }
}

export default UserController
