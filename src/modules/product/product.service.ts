import { NextFunction, Response } from 'express'
import { RequestWithUser } from 'interfaces'
import { ProductFilter, ProductInput } from 'interfaces/product.interface'
import { errorMessages } from '../../constants'
import { Product } from '../../entities/product.entity'
import HttpException from '../../exceptions/Http.exception'
import ServerErrorException from '../../exceptions/ServerError.exception'
import { ProductRepository } from './product.repository'

export class ProductService {
  private productRepo = new ProductRepository()

  public async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const filter: ProductFilter = req.query ?? {}
      console.log('📢[product.service.ts:15]: filter: ', filter)
      const [products, total] = await this.productRepo.getAll(filter)

      return res.status(200).json({
        success: true,
        products,
        total
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async getOne(id: string, res: Response, next: NextFunction) {
    try {
      const product = await Product.findOneBy({
        id
      })

      if (!product) {
        next(new HttpException(404, errorMessages.notFoundProduct))
      }

      return res.status(200).json({
        success: true,
        product
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { name, categoryId, description, imageId, price } =
        req.body as ProductInput

      if (!categoryId) {
        next(new HttpException(404, errorMessages.notFoundCategory))
      }

      const existedProducts = await this.productRepo.getAll({
        keyword: name
      })

      if (existedProducts[1] > 0) {
        next(new HttpException(404, errorMessages.existedProduct))
      }

      const newProduct = Product.create({
        name,
        description,
        price,
        imageId,
        categoryId
      })

      await newProduct.save()

      return res.status(301).json({
        success: true,
        product: newProduct
      })
    } catch (err) {
      next(new ServerErrorException())
    }
  }

  public async update(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id, ...input } = req.body as ProductInput

      const existedProduct = await Product.findOneBy({ id })

      if (!existedProduct) {
        next(new HttpException(404, errorMessages.notFoundProduct))
      }

      const updatedProduct = await Product.save({
        id,
        ...existedProduct,
        ...input
      })

      return res.status(301).json({
        success: true,
        product: updatedProduct
      })
    } catch (err) {
      next(new ServerErrorException())
    }
  }

  public async delete(id: string, res: Response, next: NextFunction) {
    try {
      await Product.delete({ id })

      return res.status(200).json({
        success: true
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }
}
