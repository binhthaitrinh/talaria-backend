import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDocument } from 'src/models/users/users.types';
import { User } from '../models/users/users.model';
import AppError from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { v4 } from 'uuid';
import { FORGOT_PASSWORD_PREFIX } from '../constants';
import { Email } from '../utils/sendEmail';

const signToken = (id: string) => {
  return jwt.sign({ id }, <string>process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: IUserDocument,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000
    ),
    // only send cookie on https
    // secure: process.env.NODE_ENV === 'production' ? true : false,
    secure: true,
    httpOnly: true,
    // sameSite: 'none',
    // domain:
    //   // process.env.NODE_ENV === 'prodution'
    //   // '.talaria-web.vercel.app',

    //   undefined,
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    //   await User.deleteMany({});
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  }
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log('CALLED');
    console.log(email, password);

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // get user based on email
    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    );

    // compare inputted password with password from db
    const correct = await user?.comparePassword(password);

    if (!correct) {
      return next(new AppError('Invalid credentials', 401));
    }

    // by this point, everything is OK
    createSendToken(user!, 200, res);
    res.locals.user = user;
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // find user in db
    const user = await User.findOne({ email });

    // handle error if no user found
    if (!user) {
      return next(
        new AppError('There is no user with this email address', 404)
      );
    }

    // if user found, create resetToken
    const resetToken = v4();
    console.log(resetToken);

    // save token into cache, expire in 3 days
    await redisClient.set(
      `${FORGOT_PASSWORD_PREFIX}${resetToken}`,
      user._id,
      'ex',
      1000 * 60 * 60 * 24 * 3
    );

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Go to this url: ${resetUrl}`;

    try {
      await new Email(user, resetUrl).send(
        'default',
        'Reset Password',
        message
      );

      res.status(200).json({
        status: 'success',
        message: 'Reset password URL sent to email!',
      });
    } catch (err) {
      console.log(err);
      await redisClient.del(`${FORGOT_PASSWORD_PREFIX}${resetToken}`);
      return next(
        new AppError(
          'There was an error sending email. Please try again later',
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get password from form
    const { password } = req.body;

    if (!password) {
      return next(new AppError('please provide new password', 401));
    }
    const { resetToken } = req.params;
    const userId = await redisClient.get(
      `${FORGOT_PASSWORD_PREFIX}${resetToken}`
    );
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = password;
    user.passwordConfirm = password;

    // .save() so that model will call middleware
    await user.save();

    createSendToken(user, 200, res);
  }
);

export const protect = catchAsync(
  async (
    req: Request & { user?: IUserDocument },
    _res: Response,
    next: NextFunction
  ) => {
    console.log('CALLED');
    var token;
    console.log(req.headers.authorization);
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    // user not logged in
    if (!token) {
      return next(
        new AppError('You are not logged in. Please log in to get access', 401)
      );
    }

    interface decodedType {
      id: string;
      iat: number;
      exp: number;
    }

    // decode token
    const decoded = <decodedType>jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401)
      );
    }

    // TODO: Check if password is changed after JWT was issued

    // grant access to protected route
    req.user = user;
    next();
  }
);

export const signout = (_req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    // cookie expire in 10s
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};
