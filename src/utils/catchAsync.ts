import { NextFunction, Response, Request } from "express";
import AppError from "./AppError";

export const catchAsync = (fn: Function) => {
  // return a function here because whatever it assigns to would be a function
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: AppError) => next(err));
  };
};
