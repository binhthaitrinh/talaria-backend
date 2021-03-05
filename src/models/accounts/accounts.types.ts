import mongoose, { Document, Model } from "mongoose";

export interface IAccount {
  accountWebsite?: string;
  loginID: string;
  teamviewInfo?: string;
  balance: mongoose.Types.Decimal128;
  currency: string;
  createdAt: number;
  updatedAt: number;
  owned: boolean;
  notes?: string;
  status: string;
  customId?: string;
}

export interface IAcctDocument extends IAccount, Document {}

export interface IAcctModel extends Model<IAcctDocument> {}
