import { UserService } from '../modules/user/user.service'
import SocketIO from 'socket.io'
import { User } from './../entities/user.entity'

export class SocketServer {
  public socketIo: SocketIO.Server
  public clients = {}
  public userService = new UserService()

  constructor(socketIo) {
    this.socketIo = socketIo
  }

  public initializeSocket = () => {
    this.socketIo.on('connection', async (socket) => {
      try {
        const user: User = await User.findOneBy({})

        socket.on('disconnect', () => {
          this.clients = {}
          console.log('📢[index.ts:20]: user disconnected...')
        })
      } catch (e) {
        throw e
      }
    })
  }
}
