import express from "express";
import authenticationRoute from "./authentication";
import userRoute from "./users";
const router = express.Router();

export default (): express.Router => {
  authenticationRoute(router);
  userRoute(router);
  return router;
};
