import mongoose, { Types } from 'mongoose';
import AppError from '../../utils/AppError';
import { IGiftcardDocument, IGiftcardModel } from './giftcard.types';
import { MUL } from '../../constants';
import { Crypto } from '../crypto/crypto.model';
import { Transaction } from '../transaction/transactions.model';
import { decToStr } from '../../utils';

const giftcardSchema = new mongoose.Schema<IGiftcardDocument, IGiftcardModel>(
  {
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
          enum: ['vnd', 'usd', 'btc'],
        },
      },
      required: [true, 'There must be a price'],
      // get: (v: Types.Decimal128) => parseFloat(v.toString()),
    },

    fee: {
      value: {
        type: mongoose.Types.Decimal128,
        default: 0.0,
        // get: (v: Types.Decimal128) => parseFloat(v.toString()),
      },
      currency: {
        type: String,
        enum: ['vnd', 'usd', 'btc'],
        default: 'btc',
      },
    },
    value: {
      type: mongoose.Types.Decimal128,
      required: [true, 'there must be a value associated with a giftcard'],
    },
    website: {
      type: String,
      enum: [
        'amazon',
        'sephora',
        'ebay',
        'walmart',
        'bestbuy',
        'costco',
        'others',
      ],
      required: [true, 'there must be a website associated'],
    },
    discountRate: mongoose.Types.Decimal128,
    partialBalance: [
      {
        rate: {
          type: mongoose.Types.Decimal128,
          get: (v: Types.Decimal128) => (v ? parseFloat(v.toString()) : null),
        },
        balance: {
          type: mongoose.Types.Decimal128,
          get: (v: Types.Decimal128) => (v ? parseFloat(v.toString()) : null),
        },
      },
    ],
    remainingBalance: {
      type: mongoose.Types.Decimal128,
      get: (v: Types.Decimal128) => (v ? parseFloat(v.toString()) : null),
    },
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
      // unique: true,
    },
    transaction: {
      type: mongoose.Types.ObjectId,
      ref: 'Transaction',
    },
    fromAccount: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: [
        true,
        'There must be an account associated with this giftcard purchase',
      ],
    },
    toAccount: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
      required: [
        true,
        'There must be an account associated with this giftcard purchase',
      ],
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.createdAt = decToStr(ret.createdAt, 'date');
        ret.updatedAt = decToStr(ret.updatedAt, 'date');
        ret.price = decToStr(ret.price.value, ret.price.currency);
        ret.fee = decToStr(ret.fee.value, ret.fee.currency);
        ret.value = decToStr(ret.value, 'usd');
        ret.discountRate = ret.discountRate
          ? decToStr(ret.discountRate, 'percent')
          : undefined;
        ret.remainingBalance = decToStr(ret.remainingBalance, 'usd');
        ret.btcUsdRate = decToStr(ret.btcUsdRate, 'usd');
        ret.usdVndRate = decToStr(ret.usdVndRate, 'vnd');
        return ret;
      },
    },
  }
);

// save value to remainingBalanace
giftcardSchema.pre<IGiftcardDocument>('save', async function (next) {
  this.remainingBalance = this.value;
  next();
});

giftcardSchema.pre<IGiftcardDocument>('save', async function (next) {
  // if bought with vnd || usd, just calculate the partialBalance rates,
  // no cryptos querying needed
  if (this.price.currency === 'vnd') {
    const partialBalance = [];
    const rate =
      Math.round((this.price.value * MUL + this.fee.value * MUL) / this.value) /
      MUL;
    partialBalance.push({ rate, balance: this.value });
    this.partialBalance = partialBalance;
    this.discountRate = 1 - Math.round(rate * MUL) / (this.usdVndRate * MUL);
    return next();
  }
  if (this.price.currency === 'usd') {
    return next(new AppError('cannot buy with USD yet', 400));
  }

  // TODO: corner case: when not enough BTC balance in cryptos

  // if bought with BTC, we need to query cryptos
  try {
    const cryptos = await Crypto.find(
      { 'remainingBalance.amount': { $gt: 0 } },
      { remainingBalance: 1 },
      { sort: { createdAt: 1, _id: 1 } }
    );

    if (cryptos.length <= 0) {
      return next(
        new AppError('Please check if there are enough cryptos left', 400)
      );
    }

    const totalBtcAvailable = cryptos.reduce(
      (acc: number, current: any) =>
        Math.round(
          acc * MUL +
            parseFloat(current.remainingBalance.amount.toString()) * MUL
        ) / MUL,
      0
    );

    const totalBtcNeeded =
      Math.round(this.price.value * MUL + this.fee.value * MUL) / MUL;

    console.log(totalBtcAvailable);

    if (totalBtcAvailable < totalBtcNeeded) {
      return next(
        new AppError(
          'Cryptos remaining balance is not enough. Consider buying more cryptos',
          400
        )
      );
    }
    let remainingBtc = totalBtcNeeded;
    let remainingGc = this.value;
    const rates = [];
    let i = 0;
    const cryptoLength = cryptos.length;
    const promises = [];

    let curCryptoBalance = parseFloat(
      cryptos[0].remainingBalance.amount.toString()
    );

    // for cryptos that will be consumed as a whole
    while (i < cryptoLength && remainingBtc > curCryptoBalance) {
      const curCrypto = cryptos[i];
      const btcVndRate = parseFloat(
        curCrypto.remainingBalance.rating.toString()
      );

      const gcVndRate =
        Math.round((btcVndRate * MUL * totalBtcNeeded) / this.value) / MUL;
      const partialBalance =
        Math.round(
          (curCryptoBalance * MUL * MUL * this.value) / (totalBtcNeeded * MUL)
        ) / MUL;
      const partialRate = { rate: gcVndRate, balance: partialBalance };
      rates.push(partialRate);
      remainingGc = Math.round(remainingGc * MUL - partialBalance * MUL) / MUL;
      remainingBtc =
        Math.round(remainingBtc * MUL - curCryptoBalance * MUL) / MUL;
      promises.push(
        Crypto.updateOne(
          { _id: curCrypto._id },
          { $set: { 'remainingBalance.amount': 0 } }
        )
      );

      // update for the loop
      i += 1;
      curCryptoBalance = parseFloat(
        cryptos[i].remainingBalance.amount.toString()
      );
    }

    if (i >= cryptoLength) {
      return next(new AppError('Not enought BTC', 400));
    }

    // for the last crypto deposit
    const curCrypto = cryptos[i];
    const btcVndRate = parseFloat(curCrypto.remainingBalance.rating.toString());
    const gcVndRate =
      Math.round((btcVndRate * MUL * totalBtcNeeded) / this.value) / MUL;
    const partialRate = {
      rate: gcVndRate,
      balance: remainingGc,
    };

    rates.push(partialRate);

    const btcLeft =
      Math.round(curCryptoBalance * MUL - remainingBtc * MUL) / MUL;

    promises.push(
      Crypto.updateOne(
        { _id: curCrypto._id },
        { $set: { 'remainingBalance.amount': btcLeft } }
      )
    );

    this.partialBalance = rates;

    this.discountRate =
      1 -
      ((parseFloat(this.price.value.toString()) +
        parseFloat(this.fee.value.toString())) *
        parseFloat(this.btcUsdRate.toString())) /
        parseFloat(this.value.toString());

    await Promise.all(promises);

    next();
  } catch (err) {
    return next(err);
  }
});

// create transaction
giftcardSchema.pre<IGiftcardDocument>('save', async function (next) {
  console.log('from account: ', this.fromAccount);
  try {
    const transaction = await Transaction.create({
      fromAcct: this.fromAccount,
      toAcct: this.toAccount,
      amountSent: {
        value:
          Math.round(
            this.price.value * 100000000 + this.fee.value * 100000000
          ) / 100000000,
        currency: this.price.currency,
      },
      amountRcved: {
        value: this.value,
        currency: 'usd',
      },
    });
    if (!transaction) {
      return next(
        new AppError('Error processing. Please double check input', 400)
      );
    }
    this.transaction = transaction._id;
    return next();
  } catch (err) {
    return next(new AppError(err, 500));
  }
});

export default giftcardSchema;
