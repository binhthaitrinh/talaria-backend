import mongoose from "mongoose";
import { IGiftcard, IGiftcardDocument, IGiftcardModel } from "./giftcard.types";

const giftcardSchema = new mongoose.Schema<IGiftcardDocument, IGiftcardModel>({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  notes: String,
  price: {
    type: {
      value: mongoose.Types.Decimal128,
      currency: {
        type: String,
        enum: ["vnd", "usd", "btc"],
      },
    },
    required: [true, "There must be a price"],
  },
  fee: {
    value: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
    },
    currency: {
      type: String,
      enum: ["vnd", "usd", "btc"],
    },
  },
  value: {
    type: mongoose.Types.Decimal128,
    required: [true, "there must be a value associated with a giftcard"],
  },
  website: {
    type: String,
    enum: [
      "amazon",
      "sephora",
      "ebay",
      "walmart",
      "bestbuy",
      "costco",
      "others",
    ],
    required: [true, "there must be a website associated"],
  },
  discountRate: mongoose.Types.Decimal128,
  partialBalance: [
    {
      rate: mongoose.Types.Decimal128,
      balance: mongoose.Types.Decimal128,
    },
  ],
  btcUsdRate: {
    type: mongoose.Types.Decimal128,
    default: 50000,
  },
  usdVndRate: {
    type: mongoose.Types.Decimal128,
    default: 24000,
  },
  pics: [String],
  customId: {
    type: String,
    unique: true,
  },
  transaction: {
    type: mongoose.Types.ObjectId,
    ref: "Transaction",
  },
  fromAccount: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
    required: [
      true,
      "There must be an account associated with this giftcard purchase",
    ],
  },
  toAccount: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
    required: [
      true,
      "There must be an account associated with this giftcard purchase",
    ],
  },
});

export default giftcardSchema;
