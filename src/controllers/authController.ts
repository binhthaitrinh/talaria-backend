import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUserDocument } from "src/models/users/users.types";
import { User } from "../models/users/users.model";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { v4 } from "uuid";
import { FORGOT_PASSWORD_PREFIX } from "../constants";
import { Email } from "../utils/sendEmail";

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
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
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

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // get user based on email
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    // compare inputted password with password from db
    const correct = await user?.comparePassword(password);

    if (!correct) {
      return next(new AppError("Invalid credentials", 401));
    }

    // by this point, everything is OK
    createSendToken(user!, 200, res);
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
        new AppError("There is no user with this email address", 404)
      );
    }

    // if user found, create resetToken
    const resetToken = v4();
    console.log(resetToken);

    // save token into cache, expire in 3 days
    await redisClient.set(
      `${FORGOT_PASSWORD_PREFIX}${resetToken}`,
      user._id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Go to this url: ${resetUrl}`;

    try {
      await new Email(user, resetUrl).send(
        "default",
        "Reset Password",
        message
      );

      res.status(200).json({
        status: "success",
        message: "Reset password URL sent to email!",
      });
    } catch (err) {
      console.log(err);
      await redisClient.del(`${FORGOT_PASSWORD_PREFIX}${resetToken}`);
      return next(
        new AppError(
          "There was an error sending email. Please try again later",
          500
        )
      );
    }
  }
);
