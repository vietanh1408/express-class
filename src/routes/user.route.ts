import UserController from "../controllers/user.controller";
import express from "express";

class UserRoute {
  public path: string = "/users";
  public router = express.Router();
  public controller = new UserController();

  constructor() {
    this.mapRoutes();
  }

  private mapRoutes() {
    this.router.get(this.path, this.controller.getAllUsers);
    this.router.get(`${this.path}/:id`, this.controller.getUserById);
  }
}

export default UserRoute;
