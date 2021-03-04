import express from "express";
import { forgotPassword, signin, signup } from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgot-password", forgotPassword);

export default userRouter;
