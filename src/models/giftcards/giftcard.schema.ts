import mongoose from "mongoose";
import AppError from "../../utils/AppError";
import { Transaction } from "../transaction/transactions.model";
import { IGiftcard, IGiftcardDocument, IGiftcardModel } from "./giftcard.types";
import { MUL } from "../../constants";
import { PartialBalance } from "./giftcard.types";

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
  remainingBalance: mongoose.Types.Decimal128,
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

// save value to remainingBalanace
giftcardSchema.pre<IGiftcardDocument>("save", async function (next) {
  this.remainingBalance = this.value;
  next();
});

giftcardSchema.pre<IGiftcardDocument>("save", async function (next) {
  // if bought with vnd || usd, just calculate the partialBalance rates,
  // no cryptos querying needed
  if (this.price.currency === "vnd") {
    const partialBalance = [];
    const rate =
      Math.round((this.price.value * MUL + this.fee.value * MUL) / this.value) /
      MUL;
    partialBalance.push({ rate, balance: this.value });
    this.partialBalance = partialBalance;
    this.discountRate = 1 - Math.round(rate * MUL) / (this.usdVndRate * MUL);
    return next();
  }
  if (this.price.currency === "usd") {
    return next(new AppError("cannot buy with USD yet", 400));
  }

  // if bought with BTC, we need to query cryptos
  next();
});

// create transaction
// giftcardSchema.pre<IGiftcardDocument>("save", async function (next) {
//   try {
//     const transaction = await Transaction.create({
//       fromAcct: this.fromAccount,
//       toAcct: this.toAccount,
//       amountSent: {
//         value:
//           Math.round(
//             this.price.value * 100000000 + this.fee.value * 100000000
//           ) / 100000000,
//         currency: this.price.currency,
//       },
//       amountRcved: {
//         value: this.value,
//         currency: "usd",
//       },
//     });
//     if (!transaction) {
//       return next(
//         new AppError("Error processing. Please double check input", 400)
//       );
//     }
//     this.transaction = transaction._id;
//     return next();
//   } catch (err) {
//     return next(new AppError(err, 500));
//   }
// });

export default giftcardSchema;
