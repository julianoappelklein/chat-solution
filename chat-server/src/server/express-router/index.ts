import { Router } from "express";
import { UsersRouter } from "./users-routes";

export const router = Router();
router.use("/users", UsersRouter);