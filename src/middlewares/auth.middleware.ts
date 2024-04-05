import express, { NextFunction } from "express";
import { getUserBySessionToken } from "../database/schemas/users";
import { autoInjectable } from "tsyringe";
import { CacheService } from "../cache/cache.service";

@autoInjectable()
export class AuthMiddleware {
  private cacheSvc: CacheService;
  constructor(cacheService: CacheService) {
    this.cacheSvc = cacheService;
  }

  CheckIsAuthenticatedHandler = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const sessionToken = req.cookies["REST-API-AUTH"];
      if (!sessionToken) {
        return res.status(403).send("not authenticated");
      }

      const existingUser = await getUserBySessionToken(sessionToken);
      if (!existingUser) {
        return res.status(400).send("sessiontoken not found or expired");
      }

      await this.cacheSvc.saveUserExist(
        existingUser["_id"].toString(),
        existingUser
      );
      return next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
}
