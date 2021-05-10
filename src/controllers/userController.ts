import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users/users.model';
import * as factory from './handleFactory';
import { IUserDocument } from '../models/users/users.types';
import { catchAsync } from '../utils/catchAsync';
import sharp from 'sharp';
import multer from 'multer';
import { uploadFile, getFileStream } from '../utils/s3';
import AppError from '../utils/AppError';

const multerStorage = multer.memoryStorage();

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
    await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { returnOriginal: false }
    );
    res.status(200).json({ status: 'success', data: null });
  }
);

const multerFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single('image');

export const resizeUserPhoto = catchAsync(
  async (
    req: Request & { user: { _id: string } },
    res: Response,
    _next: NextFunction
  ) => {
    if (!req.file) return new AppError('Please provide a picture', 400);

    const filename = `${req.user._id}-${Date.now().toString()}.jpeg`;

    const result = sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 });
    // .toFile(`public/img/users/${req.file.filename}`);

    await uploadFile(result, filename);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePicture: filename,
      },
      { returnOriginal: false }
    );

    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }
);

export const getProfilePic = (req: Request, res: Response) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
};
