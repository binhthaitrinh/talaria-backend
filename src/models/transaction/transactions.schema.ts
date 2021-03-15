import mongoose, { Schema } from "mongoose";
import { ITransactionDocument, ITransactionModel } from "./transactions.types";

const transactionSchema = new Schema<ITransactionDocument, ITransactionModel>({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  amountSent: {
    value: mongoose.Types.Decimal128,
    currency: {
      type: String,
      enum: ["vnd", "usd", "btc"],
    },
  },
  sentFee: {
    value: mongoose.Types.Decimal128,
    currency: {
      type: String,
      enum: ["vnd", "usd", "btc"],
    },
  },
  amountRcved: {
    value: mongoose.Types.Decimal128,
    currency: {
      type: String,
      enum: ["vnd", "usd", "btc"],
    },
  },
  fromBal: mongoose.Types.Decimal128,
  toBal: mongoose.Types.Decimal128,
  notes: String,
  item: {
    type: mongoose.Types.ObjectId,
    ref: "Item",
  },
  bill: {
    type: mongoose.Types.ObjectId,
    ref: "Bill",
  },
  affiliate: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  fromAcct: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
  },
  toAcct: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
  },
});

export default transactionSchema;
