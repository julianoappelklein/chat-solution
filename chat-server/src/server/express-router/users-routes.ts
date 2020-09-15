import { Router } from "express";
import { serviceLocator } from "../service-locator";
import { jsonResponse, validateRequestBodyData } from "./utils";
const userApplicationService = serviceLocator.getUserApplicationService();
const jwtService = serviceLocator.getJWTService();

import Joi from "joi";

const UsersRouter = Router();
UsersRouter.post("/authenticate", (req, res, next) => {
  if (
    validateRequestBodyData(
      req,
      res,
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }).required()
    )
  ) {
    userApplicationService
      .authenticate(req.body)
      .then((user) => {
        if (user != null) {
          const token = jwtService.signUserData({
            userId: user.getId(),
            username: user.getUsername(),
          });
          jsonResponse(res, token);
        } else {
          jsonResponse(res, null);
        }
      })
      .catch((err) => next(err));
  }
});

UsersRouter.post("/register", (req, res, next) => {
  if (
    validateRequestBodyData(
      req,
      res,
      Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().required().min(5).max(36).required(),
      }).required()
    )
  ) {
    userApplicationService
      .registerUser(req.body)
      .then((user) => {
        jsonResponse(res, user);
      })
      .catch((err) => next(err));
  }
});

export { UsersRouter };
