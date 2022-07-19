import { NextFunction, Request, Response, Router } from 'express'
import { UploadService } from './upload.service'
import * as cloud from 'cloudinary'
import multer from 'multer'
import { environments } from '../../constants/index'
import { RequestWithUser } from 'interfaces'
class UploadController {
  public path = '/upload'
  public router = Router()

  private storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, 'uploads')
    },
    filename: (_req, file, callback) => {
      callback(null, file.fieldname + '-' + Date.now())
    }
  })

  private uploadDest = multer({ storage: this.storage })
  private uploadService = new UploadService()

  constructor() {
    this.configCloudinary()
    this.mapRoutes()
  }

  private configCloudinary() {
    cloud.v2.config({
      cloud_name: environments.CLOUD_NAME,
      api_key: environments.CLOUD_API_KEY,
      api_secret: environments.CLOUD_API_SECRET,
      secure: true
    })
  }

  private mapRoutes() {
    this.router.post(this.path, this.uploadDest.single('files'), this.upload)
    this.router.post(
      `${this.path}/multiple`,
      this.uploadDest.array('files'),
      this.uploadMultiple
    )
    this.router.delete(`${this.path}/:id`, this.remove)
  }

  public upload = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    return this.uploadService.upload(req, res, next)
  }

  public uploadMultiple = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    return this.uploadService.uploadMultiple(req, res, next)
  }

  public remove = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    return this.uploadService.remove(req, res, next)
  }
}

export default UploadController
