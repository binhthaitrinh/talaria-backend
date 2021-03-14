import { model } from "mongoose";
import transactionSchema from "./transactions.schema";
import { ITransactionDocument } from "./transactions.types";

export const Transaction = model<ITransactionDocument>(
  "Transaction",
  transactionSchema
);
