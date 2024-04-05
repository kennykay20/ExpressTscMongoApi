import express from "express";
import { AuthenticationService } from "./auth.service";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export default class AuthenticationController {
  authSrv: AuthenticationService;
  constructor(authenService: AuthenticationService) {
    this.authSrv = authenService;
  }

  RegisterUser = async (req: express.Request, res: express.Response) => {
    return await this.authSrv.registerUser(req, res);
  };

  LoginUser = async (req: express.Request, res: express.Response) => {
    return await this.authSrv.loginUser(req, res);
  }
}
