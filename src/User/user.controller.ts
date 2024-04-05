import express from "express";
import { autoInjectable } from "tsyringe";
import { UserService } from "./user.service";

@autoInjectable()
export class UserController {
  userSrv: UserService;
  constructor(userService: UserService) {
    this.userSrv = userService;
  }

  GetAllUsers = async (req: express.Request, res: express.Response) => {
    return await this.userSrv.getAllUsers(req, res);
  };

  UpdateUser = async (req: express.Request, res: express.Response) => {
    return await this.userSrv.updateUser(req, res);
  }
  DeleteUser = async (req: express.Request, res: express.Response) => {
    return await this.userSrv.deleteUser(req, res);
  };
}
