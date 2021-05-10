import { Document, Model } from 'mongoose';

export interface IWarehouse {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  phone?: string;
  customId: string;
  deliveredTo: string;
}

export interface IWarehouseDocument extends IWarehouse, Document {}

export interface IWarehouseModel extends Model<IWarehouseDocument> {}
