import { Router } from "express";
import UserRouter from "./users";

export const router = Router();
router.use("/users", UserRouter);