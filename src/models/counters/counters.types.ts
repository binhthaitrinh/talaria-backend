import { Document, Model } from "mongoose";

export interface ICounter {
  value: number;
  modelName: string;
}

export interface ICounterDocument extends ICounter, Document {}
export interface ICounterModel extends Model<ICounterDocument> {}
