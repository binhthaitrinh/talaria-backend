import express from "express";
import { sign } from "jsonwebtoken";
import { signup } from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/signup", signup);

export default userRouter;
