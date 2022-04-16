import { Secret, sign } from 'jsonwebtoken'
import { User } from '../entities/user.entity'

export const createToken = (
  type: 'accessToken' | 'refreshToken',
  user: User
): string => {
  return sign(
    { userId: user.id, role: user.role },
    type === 'accessToken'
      ? (process.env.ACCESS_TOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === 'accessToken' ? '5m' : '30d'
    }
  )
}
