import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { UserController } from "../User/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserMiddleware } from "../middlewares/user.middleware";

const userController = container.resolve(UserController);
const authMid = container.resolve(AuthMiddleware);
const userMid = container.resolve(UserMiddleware);

export default (router: express.Router) => {
  console.log("call the route");
  router.get(
    "/api/v1/users",
    authMid.CheckIsAuthenticatedHandler,
    userController.GetAllUsers
  );
  router.put(
    "/api/v1/user/:id",
    authMid.CheckIsAuthenticatedHandler,
    userMid.IsOwnerHandler,
    userController.UpdateUser
  );
  router.delete(
    "/api/v1/user/:id",
    authMid.CheckIsAuthenticatedHandler,
    userMid.IsOwnerHandler,
    userController.DeleteUser
  );
};
