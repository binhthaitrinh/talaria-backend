import { Document, Model } from 'mongoose';

export interface IAccount {
  website?: string;
  name: string;
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
