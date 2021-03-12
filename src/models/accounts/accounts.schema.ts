import mongoose, { Schema } from "mongoose";
import { IAcctDocument, IAcctModel } from "./accounts.types";

const accountSchema = new Schema<IAcctDocument, IAcctModel>({
  website: {
    type: String,
    enum: [
      "amazon",
      "sephora",
      "ebay",
      "bestbuy",
      "costco",
      "walmart",
      "others",
    ],
  },
  name: {
    type: String,
    required: [true, "An account must have a name"],
  },
  balance: {
    type: mongoose.Types.Decimal128,
    default: 0,
  },
  currency: {
    type: String,
    enum: ["vnd", "usd", "btc"],
    required: [true, "An account must have currency"],
  },
  status: {
    type: String,
    enum: ["active", "inactive", "disputing"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  notes: String,
  customId: {
    type: String,
    unique: true,
  },
});

export default accountSchema;
