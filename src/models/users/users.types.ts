import { Document, Model } from "mongoose";

interface SocialMedia {
  website: string;
  link: string;
}

interface BankAcct {
  bankName: string;
  acctNumber: string;
  bankLocation?: string;
}

interface CommissionRate {
  website: string;
  rate: number;
}

interface Address {
  streetAddr: string;
  city: string;
}

interface Profile {
  updatedAt?: number;
  socialMedias?: [SocialMedia];
  phoneNumbers?: [string];
  bankAccts?: [BankAcct];
  commissionRates?: [CommissionRate];
  dob?: number;
  customerType?: string;
  address?: [Address];
  discountRates?: [CommissionRate];
}

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
  profile: Profile;
}

export interface IUserDocument extends IUser, Document {
  comparePassword: (
    this: IUserDocument,
    candidatePassword: string
  ) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}
