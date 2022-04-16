import { Response } from 'express'
import { User } from '../entities/user.entity'
import { ResponseSuccess } from './common.interface'

export interface RegisterInput {
  username: string
  password: string
}

export interface LoginInput {
  username: string
  password: string
}

export interface RegisterResponse extends Response {
  user: Omit<User, 'password'>
  accessToken: string
  success: ResponseSuccess
}
