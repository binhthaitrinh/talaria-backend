import { Document, Model } from 'mongoose';
import { MoneyType } from '../../types';

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
  items: string[];
  affiliate: string;
  afterDiscount: number;
  totalEstimatedWeight: number;
}

export interface IBillDocument extends IBill, Document {
  calcBill: (this: IBillDocument) => Promise<IBillDocument | null>;
}

export interface IBillModel extends Model<IBillDocument> {}
