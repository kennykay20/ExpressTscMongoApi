import { CacheService } from "../cache/cache.service";
import express, { NextFunction } from "express";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserMiddleware {
  private cacheSvc: CacheService;
  constructor(cacheService: CacheService) {
    this.cacheSvc = cacheService;
  }

  IsOwnerHandler = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const currentUserCache = await this.cacheSvc.getUserExist(id);
      if (!currentUserCache) {
        return res.status(403).send("not authenticated ");
      }

      if (currentUserCache["_id"] !== id) {
        return res.status(403).send("cannot delete another user");
      }
      next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
}
