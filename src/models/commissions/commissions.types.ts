import { Document, Model } from 'mongoose';

export interface IComission {
  createdAt: number;
  updatedAt?: number;
  bill: string;
  affiliate: string;
  amount: number;
  status: string;
}

export interface IComissionDocument extends IComission, Document {}

export interface ICommissionModel extends Model<IComissionDocument> {}
