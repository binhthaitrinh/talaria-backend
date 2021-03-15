import { Document, Model } from "mongoose";
import { MoneyType } from "../../types";

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
