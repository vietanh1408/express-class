import { NextFunction, Request, Response, Router } from 'express'
import { Controller } from 'interfaces/controller.interface'
import { verifyAdmin, verifyAuth } from '../../middleware/auth.middleware'
import { ProductService } from './product.service'

class ProductController implements Controller {
  public path = '/products'
  public router = Router()
  public productService = new ProductService()

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
    return await this.productService.getAll(req, res, next)
  }

  public getOne = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    return await this.productService.getOne(id, res, next)
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    return await this.productService.create(req, res, next)
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    return await this.productService.update(req, res, next)
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    return await this.productService.delete(id, res, next)
  }
}

export default ProductController
