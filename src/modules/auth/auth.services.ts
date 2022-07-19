import argon2 from 'argon2'
import { NextFunction, Request, Response } from 'express'
import { LoginInput, RegisterInput } from 'interfaces/auth.interface'
import { TokenList } from 'interfaces/common.interface'
import {
  Context,
  RequestWithUser,
  UserAuthPayload
} from 'interfaces/context.interface'
import { Secret, verify } from 'jsonwebtoken'
import { environments, errorMessages, RoleEnum } from '../../constants'
import { User } from '../../entities/user.entity'
import AuthorizationException from '../../exceptions/Authorization.exception'
import HttpException from '../../exceptions/Http.exception'
import ServerErrorException from '../../exceptions/ServerError.exception'
import { createToken } from '../../utils/auth'

export const tokenList: TokenList = {}
export class AuthService {
  public async register(
    input: RegisterInput,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, username, password } = input

      const existedUsername = await User.findOne({
        where: {
          username
        }
      })

      if (existedUsername) {
        next(new HttpException(404, errorMessages.existedUser))
      }

      const existedEmail = await User.findOne({
        where: {
          email
        }
      })

      if (existedEmail) {
        next(new HttpException(404, errorMessages.existedEmail))
      }

      const hashedPassword = await argon2.hash(password)

      const newUser = User.create({
        username,
        password: hashedPassword
      })

      await newUser.save()

      const accessToken = createToken('accessToken', newUser)

      return res.status(200).json({
        success: true,
        accessToken
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async login(
    input: LoginInput,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { password, username } = input

      if (!username) {
        next(new HttpException(400, errorMessages.notFoundUser))
      }

      const user: User = await User.findOne({
        where: {
          username,
          role: RoleEnum.Customer
        }
      })

      if (!user) {
        next(new HttpException(400, errorMessages.notFoundUser))
      }

      const validPassword = await argon2.verify(user.password, password)

      if (!validPassword) {
        next(new HttpException(400, errorMessages.incorrectPassword))
      }

      const accessToken = createToken('accessToken', user)

      const refreshToken = createToken('refreshToken', user)

      tokenList[refreshToken] = { accessToken, refreshToken }

      return res.status(200).json({
        success: true,
        accessToken,
        refreshToken
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  public async loginAdmin(
    input: LoginInput,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { password, username } = input

      const user = (await User.findOne({
        where: {
          username,
          role: RoleEnum.Admin
        }
      })) as User

      if (!user) {
        next(new HttpException(400, errorMessages.notFoundUser))
      }

      const validPassword = await argon2.verify(user.password, password)

      if (!validPassword) {
        next(new HttpException(400, errorMessages.incorrectPassword))
      }

      const accessToken = createToken('accessToken', user)

      const refreshToken = createToken('refreshToken', user)

      tokenList[refreshToken] = { accessToken, refreshToken }

      return res.status(200).json({
        success: true,
        accessToken,
        refreshToken
      })
    } catch (error) {
      next(new ServerErrorException())
    }
  }

  // this api using after accessToken expired, client will call this api to get new accessToken and server will response new accessToken
  public async refreshToken(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const refreshTokenFromClient: string = req.body.refreshToken

    const context: Context = {
      req,
      res,
      user: null
    }

    if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
      try {
        const decodedToken = (await verify(
          refreshTokenFromClient,
          environments.REFRESH_TOKEN_SECRET as Secret
        )) as UserAuthPayload

        context.user = decodedToken
        const user = await User.findOneBy({
          id: context.user.userId.toString()
        })

        if (!user) {
          next(new AuthorizationException())
        }

        const accessToken = await createToken('accessToken', user)

        return res.status(200).json({
          success: true,
          accessToken
        })
      } catch (err) {
        res.status(403).json({
          message: errorMessages.invalidToken
        })
      }
    } else {
      next(new HttpException(403, errorMessages.noTokenProvided))
    }
  }
}
