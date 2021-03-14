import { Document, Model } from "mongoose";

interface MoneyType {
  value: number;
  currency: string;
}

export interface ITransaction {
  createdAt: number;
  updatedAt?: number;
  amountSent?: MoneyType;
  sentFee?: MoneyType;
  amountRcved?: MoneyType;
  fromBal?: number;
  toBal?: number;
  notes?: string;
  item?: string;
  bill?: string;
  affiliate?: string;
  fromAcct?: string;
  toAcct?: string;
}

export interface ITransactionDocument extends ITransaction, Document {}

export interface ITransactionModel extends Model<ITransactionDocument> {}
