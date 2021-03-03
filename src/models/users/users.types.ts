import { Document, Model } from "mongoose";

export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  profilePicture: string;
  role: string;
  password?: string;
  passwordConfirm?: string;
  passwordChangedAt?: number;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  active?: boolean;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}
