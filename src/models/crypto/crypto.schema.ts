import mongoose, { Schema } from 'mongoose';
import { ICryptoDocument, ICryptoModel } from './crypto.types';
import AppError from '../../utils/AppError';
import { Transaction } from '../transaction/transactions.model';
import { decToStr } from '../../utils';

const cryptoSchema = new Schema<ICryptoDocument, ICryptoModel>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    btcAmount: {
      type: mongoose.Types.Decimal128,
      required: [true, 'There must be some amount of BTC purchased'],
    },
    withdrawFee: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
    },
    moneySpent: {
      value: {
        type: mongoose.Types.Decimal128,
        required: [true, 'You must have spent some money to buy BTC'],
      },
      currency: {
        type: String,
        enum: ['vnd', 'usd'],
        required: [true, 'There must be a currency'],
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
      // unique: true,
    },
    transaction: {
      type: mongoose.Types.ObjectId,
      ref: 'Transaction',
    },
    buyer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    fromAccount: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: [true, 'There must be an account associated with fromAccount'],
    },
    toAccount: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Buying crypto must be associated with an account'],
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.createdAt = decToStr(ret.createdAt, 'date');
        ret.updatedAt = decToStr(ret.updatedAt, 'date');
        ret.btcAmount = decToStr(ret.btcAmount, 'btc');
        ret.withdrawFee = decToStr(ret.withdrawFee, 'btc');
        ret.moneySpent = ret.moneySpent
          ? decToStr(ret.moneySpent.value, ret.moneySpent.currency)
          : undefined;
        ret.usdVndRate = decToStr(ret.usdVndRate, 'vnd');
        ret.btcUsdRate = decToStr(ret.btcUsdRate, 'usd');
        return ret;
      },
    },
  }
);

cryptoSchema.pre<ICryptoDocument>('save', async function (next) {
  try {
    // 1. create a new transaction
    const transaction = await Transaction.create({
      fromAcct: this.fromAccount,
      toAcct: this.toAccount,
      amountSent: this.moneySpent,
      amountRcved: {
        value: this.btcAmount,
        currency: 'btc',
      },
    });

    if (!transaction) {
      return next(new AppError('Problem with transaction creation', 400));
    }
    // Set field transaction
    this.transaction = transaction._id;

    // Convert currency to VND if currency is in USD
    let vndSpent = parseFloat(this.moneySpent.value.toString());
    if (this.moneySpent.currency === 'usd') {
      vndSpent = Math.round(vndSpent * 100 * this.usdVndRate * 100) / 10000;
    }

    // Set remainingBalance to btcAmount
    this.remainingBalance.amount = this.btcAmount;

    // Calculate btcVnd rating of this crypto buy
    this.remainingBalance.rating =
      Math.round(
        ((vndSpent * 100000000) /
          (this.btcAmount * 100000000 + this.withdrawFee * 100000000)) *
          100000000
      ) / 100000000;
  } catch (err) {
    return next(new AppError(err, 500));
  }

  next();
});

export default cryptoSchema;
