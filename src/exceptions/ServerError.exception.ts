import HttpException from './Http.exception'

class ServerErrorException extends HttpException {
  constructor() {
    super(500, 'Server Error')
  }
}

export default ServerErrorException
