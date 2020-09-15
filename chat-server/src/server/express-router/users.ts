import { Router } from "express";

import { serviceLocator } from "../service-locator";
import { jsonResponse } from "./utils";
var userApplicationService = serviceLocator.getUserApplicationService();

const UserRouter = Router();
UserRouter.post("/authenticate", (req, res, next) => {
  //validate req
  userApplicationService.authenticate(req.body).then(user =>{
    jsonResponse(res, user);
  }).catch((err) => next(err));
});

export default UserRouter;
