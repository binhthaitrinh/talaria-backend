import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema({
  accountWebsite: {
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
  loginID: {
    type: String,
    required: [true, "An account must have a login ID"],
  },
  teamviewInfo: String,
  balance: {
    type: mongoose.Types.Decimal128,
    default: 0,
  },
  currency: {
    type: String,
    enum: ["vnd", "usd", "btc"],
    required: [true, "An account must have currency"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  owned: {
    type: Boolean,
    default: true,
  },
  notes: String,
  status: {
    type: String,
    enum: ["active", "inactive", "disputing"],
    default: "active",
  },
  customId: {
    type: String,
    unique: true,
  },
});

export default accountSchema;
