import { NextFunction, Request, Response, Router } from 'express'
import { Controller } from 'interfaces/controller.interface'
import { CategoryService } from './category.service'

class CategoryController implements Controller {
  public path = '/categories'
  public router = Router()
  public categoryService = new CategoryService()

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
    return await this.categoryService.getAll(req, res, next)
  }

  public getOne = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    return await this.categoryService.getOne(id, res, next)
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    return await this.categoryService.create(req, res, next)
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    return await this.categoryService.update(req, res, next)
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    return await this.categoryService.delete(id, res, next)
  }
}

export default CategoryController
