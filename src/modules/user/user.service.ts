import argon2 from 'argon2'
import { NextFunction, Response } from 'express'
import { RequestWithUser } from 'interfaces'
import { UserFilter, UserInput } from 'interfaces/user.interface'
import { errorMessages } from '../../constants'
import { User } from '../../entities/user.entity'
import HttpException from '../../exceptions/Http.exception'
import ServerErrorException from '../../exceptions/ServerError.exception'
import { UserRepository } from './user.repository'

export class UserService {
  private userRepo = new UserRepository()

  public async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const filter: UserFilter = req.query ?? {}
      const [users, total] = await this.userRepo.getAll(filter)

      return res.status(200).json({
        success: true,
        users: users,
        total
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async getOne(id: string, res: Response, next: NextFunction) {
    try {
      const user = await User.findOneBy({
        id
      })

      if (!user) {
        next(new HttpException(404, errorMessages.notFoundUser))
      }

      return res.status(200).json({
        success: true,
        user
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { email, password, username, role } = req.body as UserInput

      const existedUsers = await this.userRepo.getAll({
        keyword: username
      })

      if (existedUsers[1] > 0) {
        next(new HttpException(404, errorMessages.existedUser))
      }

      const hashedPassword = await argon2.hash(password)

      const newUser = User.create({
        username,
        email,
        role,
        password: hashedPassword
      })

      await newUser.save()

      return res.status(301).json({
        success: true,
        user: newUser
      })
    } catch (err) {
      next(new ServerErrorException())
    }
  }

  public async update(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id, ...input } = req.body as UserInput

      const existedUsers = await User.findOneBy({ id })

      if (!existedUsers) {
        next(new HttpException(404, errorMessages.notFoundUser))
      }

      const updatedUser = await User.save({
        id,
        ...existedUsers,
        ...input
      })

      return res.status(301).json({
        success: true,
        user: updatedUser
      })
    } catch (err) {
      next(new ServerErrorException())
    }
  }

  public async delete(id: string, res: Response, next: NextFunction) {
    try {
      await User.delete({ id })

      return res.status(200).json({
        success: true
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async getProfile(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.user

      const user = await User.findOneBy({ id: userId })

      if (!user) {
        next(new HttpException(404, errorMessages.notFoundUser))
      }

      return res.status(200).json({
        success: true,
        user
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }
}
