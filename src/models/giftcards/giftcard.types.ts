import { Document, Model, Types } from "mongoose";
import { MoneyType } from "../../types";

interface PartialBalance {
  rate: Types.Decimal128;
  balance: Types.Decimal128;
}

export interface IGiftcard {
  createdAt: number;
  updatedAt?: number;
  notes?: string;
  price: MoneyType;
  fee: MoneyType;
  value: Types.Decimal128;
  website: string;
  discountRate?: Types.Decimal128;
  remainingBalance?: Types.Decimal128;
  partialBalance?: [PartialBalance];
  btcUsdRate: Types.Decimal128;
  usdVndRate: Types.Decimal128;
  pics?: [string];
  customId?: string;
  transaction?: string;
  fromAccount: string;
  toAccount: string;
}

export interface IGiftcardDocument extends IGiftcard, Document {}

export interface IGiftcardModel extends Model<IGiftcardDocument> {}
