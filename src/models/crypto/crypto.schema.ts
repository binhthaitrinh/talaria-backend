import mongoose, { mongo, Schema } from "mongoose";
import { ICryptoDocument, ICryptoModel } from "./crypto.types";

const cryptoSchema = new Schema<ICryptoDocument, ICryptoModel>({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  btcAmount: {
    type: mongoose.Types.Decimal128,
    required: [true, "There must be some amount of BTC purchased"],
  },
  withdrawFee: {
    type: mongoose.Types.Decimal128,
    default: 0.0,
  },
  moneySpent: {
    value: {
      type: mongoose.Types.Decimal128,
      required: [true, "You must have spent some money to buy BTC"],
    },
    currency: {
      type: String,
      enum: ["vnd", "usd"],
      required: [true, "There must be a currency"],
    },
  },
  usdVndRate: {
    type: mongoose.Types.Decimal128,
    default: 24000,
  },
  btcUsdRate: {
    type: mongoose.Types.Decimal128,
    default: 60000,
  },
  remainingBalance: {
    amount: mongoose.Types.Decimal128,
    rating: mongoose.Types.Decimal128,
  },
  notes: String,
  customId: {
    type: String,
    unique: true,
  },
  transaction: {
    type: mongoose.Types.ObjectId,
    ref: "Transaction",
  },
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  fromAccount: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
  },

  toAccount: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
  },
});

export default cryptoSchema;
