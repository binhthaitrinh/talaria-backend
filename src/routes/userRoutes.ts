import express from "express";
import {
  forgotPassword,
  protect,
  resetPassword,
  signin,
  signup,
} from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.patch("/reset-password/:resetToken", resetPassword);
userRouter.get("/protect", protect);

export default userRouter;
