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
  active?: boolean;
  customId?: string;
  createdAt: number;
  notes?: string;
  profile: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword: (
    this: IUserDocument,
    candidatePassword: string
  ) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}
