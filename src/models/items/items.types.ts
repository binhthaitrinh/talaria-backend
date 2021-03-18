import { Document, Model } from "mongoose";

export interface IItem {
  createdAt: number;
  updatedAt?: number;
  name: string;
  link: string;
  pricePerItem: number;
  actPricePerItem?: number;
  quantity: number;
  tax: number;
  usShippingFee: number;
  extraShippingCost: number;
  estWgtPerItem: number;
  actWgtPerItem: number;
  actualCost?: number;
  trackingLink?: string;
  invoiceLink?: string;
  orderDate?: number;
  arrvlAtWarehouseDate?: number;
  shippingToVnDate?: number;
  arrvlAtVnDate?: number;
  customerRcvDate?: number;
  returnDate?: number;
  returnArrvlDate?: number;
  notes?: string;
  status: string;
  website: string;
  commissionRate?: number;
  itemType: string;
  customId: string;
  orderAccount?: string;
  warehouse?: string;
}

export interface IItemDocument extends IItem, Document {}

export interface IItemModel extends Model<IItemDocument> {
  buy: (
    this: IItemModel,
    _id: string,
    accountId: string
  ) => Promise<IItemDocument | null>;
}
