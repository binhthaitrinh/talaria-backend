import { Document, Model } from "mongoose";
import { socialMedia, bankAcct, commissionRate } from "../../types";

export interface IAffiliate {
  updatedAt?: Date;
  socialMedias?: [socialMedia];
  phoneNumber?: [string];
  bankAccts?: [bankAcct];
  commissionRates?: [commissionRate];
  dob?: Date;
}

export interface IAffiliateDocument extends IAffiliate, Document {}

export interface IAffiliateModel extends Model<IAffiliateDocument> {}
