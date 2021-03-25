import { NextFunction, Request, Response } from "express";
import { User } from "../models/users/users.model";
import * as factory from "./handleFactory";
import { IUserDocument } from "../models/users/users.types";

export const getMe = (
  req: Request & { user?: IUserDocument },
  _res: Response,
  next: NextFunction
) => {
  req.params.id = req.user!._id;
  next();
};

export const getUser = factory.getOne(User);
