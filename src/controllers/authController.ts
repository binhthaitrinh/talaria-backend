import { NextFunction, Request, Response } from "express";
import { User } from "../models/users/users.model";
import { catchAsync } from "../utils/catchAsync";

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    //   await User.deleteMany({});
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  }
);
