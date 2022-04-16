import { errorMessages } from '../constants'
import HttpException from './Http.exception'

class AuthorizationException extends HttpException {
  constructor() {
    super(401, errorMessages.authorization)
  }
}

export default AuthorizationException
