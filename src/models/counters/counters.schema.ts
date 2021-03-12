import { Schema } from "mongoose";
import { ICounterDocument, ICounterModel } from "./counters.types";

const counterSchema = new Schema<ICounterDocument, ICounterModel>({
  value: {
    type: Number,
    required: [true, "A counter must have an initial sequence value"],
  },
  modelName: {
    type: String,
    unique: true,
  },
});

export default counterSchema;
