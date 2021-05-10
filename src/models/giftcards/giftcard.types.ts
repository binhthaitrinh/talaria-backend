import { Document, Model } from 'mongoose';
import { MoneyType } from '../../types';

export interface PartialBalance {
  rate?: number;
  balance?: number;
}

export interface IGiftcard {
  createdAt: number;
  updatedAt?: number;
  notes?: string;
  price: MoneyType;
  fee: MoneyType;
  value: number;
  website: string;
  discountRate?: number;
  remainingBalance?: number;
  partialBalance?: PartialBalance[];
  btcUsdRate: number;
  usdVndRate: number;
  pics?: [string];
  customId?: string;
  transaction?: string;
  fromAccount: string;
  toAccount: string;
}

export interface IGiftcardDocument extends IGiftcard, Document {}

export interface IGiftcardModel extends Model<IGiftcardDocument> {}
