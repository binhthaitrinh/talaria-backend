import { Document, Model } from "mongoose";
import { MoneyType, Balance } from "../../types";

export interface ICrypto {
  createdAt: number;
  updatedAt?: number;
  btcAmount: number;
  withdrawFee: number;
  moneySpent: MoneyType;
  usdVndRate: number;
  btcUsdRate: number;
  remainingBalance: Balance;
  notes?: string;
  customId: string;
  transaction: string;
  buyer: string;
  fromAccount: string;
  toAccount: string;
}

export interface ICryptoDocument extends ICrypto, Document {}

export interface ICryptoModel extends Model<ICryptoDocument> {}
