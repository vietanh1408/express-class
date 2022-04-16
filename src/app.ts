import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { Controller } from 'interfaces/controller.interface'
import 'reflect-metadata'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { createConnection } from 'typeorm'
import { environments } from './constants'
import { entities } from './entities'
import { errorMiddleware } from './middleware/error.middleware'
import { swaggerOptions } from './utils/swagger'
import SocketIO from 'socket.io'
import { Server } from 'http'
import { SocketServer } from './socket'

const swaggerDocs = swaggerJsDoc(swaggerOptions)

class App {
  public app: express.Application

  private io: SocketIO.Server
  private server: Server
  private serverSocket: SocketServer

  constructor(controllers: Controller[]) {
    this.app = express()

    this.io = new SocketIO.Server(this.server, {
      cors: {
        origin: true
      }
    })

    this.serverSocket = new SocketServer(this.io)

    this.applySwagger()
    this.connectDatabase()
    this.applyMiddleware()
    this.applyController(controllers)
    this.errorHandling()
  }

  private async connectDatabase() {
    await createConnection({
      type: 'postgres',
      database: environments.DATABASE,
      username: environments.DATABASE_USERNAME,
      password: environments.DATABASE_PASSWORD,
      host: environments.DATABASE_HOST,
      logging: true,
      synchronize: true,
      entities,
      ssl: {
        rejectUnauthorized: false
      }
    })
  }

  private applyMiddleware() {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
    this.app.use(express.json({ limit: '50mb' }))
    this.app.use(cors())
    this.serverSocket.initializeSocket()
  }

  private applyController(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router)
    })
  }

  private errorHandling() {
    this.app.use(errorMiddleware)
  }

  private applySwagger() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  }

  public listen() {
    this.app.listen(environments.PORT, () => {
      console.log(
        `🚀🚀🚀 Server start at http://localhost:${environments.PORT} 🚩🚩🚩`
      )
    })
  }
}

export default App
