import express, { Router } from 'express'

import multer from 'multer'

class UploadController {
  public path = '/upload'
  public router = Router()
  public app: express.Application

  public storage

  constructor() {
    this.app = express()

    this.storage = multer.diskStorage({})
    this.mapRoutes()
    this.initializeUpload()
  }

  private initializeUpload() {
    this.app.use(express.static('../../storage'))
  }

  private mapRoutes() {
    this.router.post(this.path, this.upload)
  }

  public upload = async () => {
    return
  }
}

export default UploadController
