import { Document, Model } from "mongoose";

export interface IAccount {
  accountWebsite?: string;
  loginID: string;
  teamviewInfo?: string;
  balance: number;
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
