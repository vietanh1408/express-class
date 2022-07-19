import { errorMessages } from './../../constants/errorMessages'
import { NextFunction, Request, Response } from 'express'
import * as cloud from 'cloudinary'
import { environments } from '../../constants/index'
import HttpException from '../../exceptions/Http.exception'
import { FileStorage } from '../../entities/fileStorage.entity'
import { RequestWithUser } from 'interfaces'

export class UploadService {
  public async upload(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const file = req.file

      const response = await cloud.v2.uploader.upload(file.path, {
        folder: environments.CLOUD_FOLDER
      })

      const newFile = await FileStorage.create({
        publicId: response.public_id,
        url: response.url,
        secureUrl: response.secure_url,
        filePath: file.path
      }).save()

      return res.status(200).json({
        success: true,
        file: newFile
      })
    } catch (err) {
      console.log(err)
      next(new HttpException(500, errorMessages.uploadFail))
    }
  }

  public async uploadMultiple(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const files = req.files ?? []

      const newFiles: FileStorage[] = []

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        files?.map(async (file) => {
          const response = await cloud.v2.uploader.upload(file.path, {
            folder: environments.CLOUD_FOLDER
          })

          const newFile = await FileStorage.create({
            publicId: response.public_id,
            url: response.url,
            secureUrl: response.secure_url,
            filePath: file.path
          }).save()

          if (newFile) newFiles.push(newFile)
        })
      )

      return res.status(200).json({
        success: true,
        files: newFiles
      })
    } catch (err) {
      console.log(err)
      next(new HttpException(500, errorMessages.uploadFail))
    }
  }

  public async remove(req: RequestWithUser, res: Response, next: NextFunction) {
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
