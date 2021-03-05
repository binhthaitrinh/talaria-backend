import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";

export const createOne = (Model: Model<any>) => {
  return catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const doc = await Model.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    }
  );
};
