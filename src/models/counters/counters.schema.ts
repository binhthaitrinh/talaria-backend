import { Schema } from "mongoose";
import { ICounterDocument, ICounterModel } from "./counters.types";

const counterSchema = new Schema<ICounterDocument, ICounterModel>({
  value: {
    type: Number,
    default: 0,
  },
  modelName: {
    type: String,
    unique: true,
  },
});

export default counterSchema;
