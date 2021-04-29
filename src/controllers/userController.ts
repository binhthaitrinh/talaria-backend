import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users/users.model';
import * as factory from './handleFactory';
import { IUserDocument } from '../models/users/users.types';
import { catchAsync } from '../utils/catchAsync';

export const getMe = (
  req: Request & { user?: IUserDocument },
  _res: Response,
  next: NextFunction
) => {
  req.params.id = req.user!._id;
  next();
};

export const getUser = factory.getOne(User);

export const getUsers = factory.getAll(User, { active: true });

export const updateUser = factory.updateOne(User);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { returnOriginal: false }
    );
    res.status(200).json({ status: 'success', data: null });
  }
);
