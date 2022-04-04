import { Request, Response } from "express";

class UserController {
  public async getAllUsers(req: Request, res: Response) {
    console.log("get all user...");
  }

  public async getUserById(req: Request, res: Response) {
    console.log("get user by id...");
  }
}

export default UserController;
