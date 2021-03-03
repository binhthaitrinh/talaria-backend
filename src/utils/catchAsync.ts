import { NextFunction, Response, Request } from "express";

export const catchAsync = (fn: Function) => {
  // return a function here because whatever it assigns to would be a function
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
};
