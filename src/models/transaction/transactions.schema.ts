import mongoose, { Schema } from "mongoose";
import { ITransactionDocument, ITransactionModel } from "./transactions.types";
import AppError from "../../utils/AppError";
import { Account } from "../accounts/accounts.model";

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
  // sentFee: {
  //   value: mongoose.Types.Decimal128,
  //   currency: {
  //     type: String,
  //     enum: ["vnd", "usd", "btc"],
  //   },
  // },
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

// async function updateAcct(
//   id: string,
//   amount: MoneyType,
//   debit: boolean,
//   next: (err?: CallbackError | undefined) => void
// ) {
//   try {
//     const doc = await Account.findOneAndUpdate(
//       { _id: mongoose.Types.ObjectId(id), currency: amount.currency },
//       {
//         $inc: {
//           balance: amount.value * (debit ? 1 : -1),
//         },
//       },
//       { returnOriginal: false }
//     );
//     if (!doc) {
//       return next(new AppError("Cannot find account to update", 404));
//     }

//     return doc;
//   } catch (err) {
//     return next(new AppError("Something wrong with account update", 500));
//   }
// }

transactionSchema.pre<ITransactionDocument>("save", async function (next) {
  if (this.fromAcct) {
    try {
      const fromAcct = await Account.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(this.fromAcct),
          currency: this.amountSent!.currency,
          balance: {
            $gt: this.amountSent!.value,
          },
        },
        {
          $inc: {
            balance: this.amountSent!.value * -1,
          },
        },
        {
          returnOriginal: false,
        }
      );
      if (!fromAcct) {
        return next(
          new AppError(
            "Please check the account to withdraw money from again!",
            400
          )
        );
      }
      this.fromBal = fromAcct.balance;
    } catch (err) {
      return next(new AppError(err, 500));
    }
  }

  if (this.toAcct) {
    try {
      const toAcct = await Account.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(this.toAcct),
          currency: this.amountRcved!.currency,
        },
        {
          $inc: {
            balance: this.amountRcved!.value * 1,
          },
        },
        {
          returnOriginal: false,
        }
      );
      if (!toAcct) {
        return next(
          new AppError(
            "Please check the account to deposit money to again!",
            400
          )
        );
      }
      this.toBal = toAcct.balance;
    } catch (err) {
      return next(new AppError(err, 500));
    }
  }

  // TODO: handle cases when error occur in toAcct, when fromAcct is already updated
  next();
});

export default transactionSchema;
