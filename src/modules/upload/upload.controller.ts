import { NextFunction, Request, Response, Router } from 'express'
import { UploadService } from './upload.service'

class UploadController {
  public path = '/upload'
  public router = Router()

  private uploadService = new UploadService()

  constructor() {
    this.mapRoutes()
  }

  private mapRoutes() {
    this.router.post(this.path, this.upload)
    this.router.delete(`${this.path}/:id`, this.remove)
  }

  public upload = async (req: Request, res: Response, next: NextFunction) => {
    return this.uploadService.upload(req, res, next)
  }

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    return this.uploadService.remove(req, res, next)
  }
}

export default UploadController
