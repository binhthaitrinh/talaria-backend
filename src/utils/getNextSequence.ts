import { NextFunction } from "express";
import { Counter } from "../models/counters/counters.model";
import AppError from "./AppError";

export const getNextSequence = async (
  modelName: string,
  next: NextFunction
) => {
  try {
    const doc = await Counter.findOneAndUpdate(
      { modelName },
      { $inc: { value: 1 } },
      { returnOriginal: false }
    );
    if (!doc) {
      return next(
        new AppError("Something is wrong with sequence documents", 400)
      );
    }
    return doc!.value;
  } catch (err) {
    console.error(err);
  }
};
