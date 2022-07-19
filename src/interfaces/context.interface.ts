import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export type UserAuthPayload = JwtPayload & {
  userId: string
  role: number
  tokenVersion: number
}

export interface Context {
  req: RequestWithUser
  res: Response
  user: UserAuthPayload | null
}

export type RequestWithUser = Request & { user: UserAuthPayload }
