import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Model, QueryOptions } from "mongoose";
import AppError from "../utils/AppError";
import APIFeatures from "../utils/APIFeatures";

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

export const getOne = (Model: Model<any>, options: QueryOptions) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);

    if (options) query = query.populate(options);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

export const getAll = (Model: Model<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Model.find({}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      status: "success",
      data: {
        data: docs,
      },
    });
  });
};
