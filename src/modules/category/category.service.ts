import { NextFunction, Response } from 'express'
import { RequestWithUser } from 'interfaces'
import { CategoryFilter, CategoryInput } from 'interfaces/category.interface'
import { errorMessages } from '../../constants'
import { Category } from '../../entities/category.entity'
import HttpException from '../../exceptions/Http.exception'
import ServerErrorException from '../../exceptions/ServerError.exception'
import { CategoryRepository } from './category.repository'

export class CategoryService {
  private categoryRepo = new CategoryRepository()

  public async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const filter: CategoryFilter = req.query ?? {}
      const [categories, total] = await this.categoryRepo.getAll(filter)

      return res.status(200).json({
        success: true,
        categories,
        total
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async getOne(id: string, res: Response, next: NextFunction) {
    try {
      const category = await Category.findOneBy({
        id
      })

      if (!category) {
        next(new HttpException(404, errorMessages.notFoundCategory))
      }

      return res.status(200).json({
        success: true,
        category
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { name, description, image } = req.body as CategoryInput

      const existedCategories = await this.categoryRepo.getAll({
        keyword: name
      })

      if (existedCategories[1] > 0) {
        next(new HttpException(404, errorMessages.existedCategory))
      }

      const newCategory = Category.create({
        name,
        description,
        image
      })

      await newCategory.save()

      return res.status(301).json({
        success: true,
        category: newCategory
      })
    } catch (err) {
      next(new ServerErrorException())
    }
  }

  public async update(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id, ...input } = req.body as CategoryInput

      const existedCategory = await Category.findOneBy({ id })

      if (!existedCategory) {
        next(new HttpException(404, errorMessages.notFoundCategory))
      }

      const updatedCategory = await Category.save({
        id,
        ...existedCategory,
        ...input
      })

      return res.status(301).json({
        success: true,
        category: updatedCategory
      })
    } catch (err) {
      next(new ServerErrorException())
    }
  }

  public async delete(id: string, res: Response, next: NextFunction) {
    try {
      await Category.delete({ id })

      return res.status(200).json({
        success: true
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }
}
