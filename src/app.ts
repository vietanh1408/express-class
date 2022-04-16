import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Controller } from "interfaces/controller.interface";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { swaggerOptions } from "utils/swagger";
import { environments } from "./constants";
import { User } from "./entities/user.entity";
import { errorMiddleware } from "./middleware/error.middleware";
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDocs = swaggerJsDoc(swaggerOptions);

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.applySwagger();
    this.connectDatabase();
    this.applyMiddleware();
    this.applyController(controllers);
    this.errorHandling();
  }

  private async connectDatabase() {
    await createConnection({
      type: "postgres",
      database: "auth-tutorial",
      username: environments.DATABASE_USERNAME,
      password: environments.DATABASE_PASSWORD,
      logging: true,
      synchronize: true,
      entities: [User],
    });
  }

  private applyMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(cors());
  }

  private applyController(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  private errorHandling() {
    this.app.use(errorMiddleware);
  }

  private applySwagger() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  public listen() {
    this.app.listen(environments.PORT, () => {
      console.log(
        `🚀🚀🚀 Server start at http://localhost:${environments.PORT} 🚩🚩🚩`
      );
    });
  }
}

export default App;
