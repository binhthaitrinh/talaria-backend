import { Document, Model } from 'mongoose';
import { MoneyType } from '../../types';
import { IItemDocument } from '../items/items.types';
import { IUserDocument } from '../users/users.types';

export interface IBill {
  createdAt: number;
  updatedAt?: number;
  usdVndRate: number;
  status: string;
  shippingRateToVn: MoneyType;
  customTax?: number;
  moneyReceived: number;
  totalBillUsd: number;
  actBillCost: number;
  actCharge: number;
  commission: number;
  paymentReceipt?: string;
  notes?: string;
  customer: string;
  items: string[] | IItemDocument[];
  affiliate: string & IUserDocument;
  afterDiscount: number;
  totalEstimatedWeight: number;
}

export interface IBillDocument extends IBill, Document {
  calcBill: (this: IBillDocument) => Promise<IBillDocument | null>;
}

export interface IBillModel extends Model<IBillDocument> {
  pay: (
    this: IBillModel,
    _id: string,
    amount: number
  ) => Promise<IBillDocument | null>;
}
