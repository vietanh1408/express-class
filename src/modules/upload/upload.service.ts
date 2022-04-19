import { errorMessages } from './../../constants/errorMessages'
import { NextFunction, Request, Response } from 'express'
import * as cloud from 'cloudinary'
import { environments } from '../../constants/index'
import HttpException from '../../exceptions/Http.exception'
import { FileStorage } from '../../entities/fileStorage.entity'

export class UploadService {
  public async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.body.data

      const response = await cloud.v2.uploader.upload(file, {
        folder: environments.CLOUD_FOLDER
      })

      const newFile = await FileStorage.create({
        publicId: response.public_id,
        url: response.url,
        secureUrl: response.secure_url
      }).save()

      return res.status(200).json({
        success: true,
        file: newFile
      })
    } catch (_err) {
      next(new HttpException(500, errorMessages.uploadFail))
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id

      const fileStorage = await FileStorage.findOneBy({ id })

      if (!fileStorage) {
        next(new HttpException(500, errorMessages.uploadFail))
      }

      await cloud.v2.uploader.destroy(fileStorage.publicId, async (err) => {
        if (err) {
          throw err
        }
        return res.status(200).json({
          success: true
        })
      })
    } catch (err) {
      next(new HttpException(500, errorMessages.uploadFail))
    }
  }
}
