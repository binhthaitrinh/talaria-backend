import { Types, Schema } from 'mongoose';
import { IBillDocument, IBillModel } from './bills.types';
import { MUL, SHIPPING_RATE_VND, USD_VND_RATE } from '../../constants';
import { decToStr } from '../../utils';
import { Commission } from '../commissions/commissions.model';
import { Item } from '../items/items.model';
import { User } from '../users/users.model';
import AppError from '../../utils/AppError';
import { Transaction } from '../transaction/transactions.model';

const billSchema = new Schema<IBillDocument, IBillModel>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    usdVndRate: {
      type: Types.Decimal128,
      default: USD_VND_RATE,
    },
    status: {
      type: String,
      enum: ['not-paid', 'partially-paid', 'fully-paid'],
      default: 'not-paid',
    },
    shippingRateToVn: {
      type: {
        value: {
          type: Types.Decimal128,
          default: SHIPPING_RATE_VND,
        },
        currency: {
          type: String,
          enum: ['vnd', 'usd', 'btc'],
          default: 'vnd',
        },
      },
    },
    customTax: {
      type: Types.Decimal128,
      default: 0.0875,
      min: [0, 'tax cannot be negative'],
    },
    moneyReceived: {
      type: Types.Decimal128,
      default: 0.0,
    },
    totalBillUsd: {
      type: Types.Decimal128,
      default: 0.0,
    },
    afterDiscount: {
      type: Types.Decimal128,
      default: 0.0,
    },
    totalEstimatedWeight: {
      type: Types.Decimal128,
      default: 0.0,
    },
    actBillCost: {
      type: Types.Decimal128,
      default: 0.0,
    },
    actCharge: {
      type: Types.Decimal128,
      default: 0.0,
    },
    commission: {
      type: Types.Decimal128,
      default: 0.0,
    },
    paymentReceipt: String,
    notes: String,
    customer: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'There must be a customer associated with this bill'],
    },
    items: {
      type: [
        {
          type: Types.ObjectId,
          ref: 'Item',
        },
      ],
    },
    affiliate: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'There must be an affiliate associated with this bill'],
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.createdAt = decToStr(ret.createdAt, 'date');
        ret.updatedAt = decToStr(ret.updatedAt, 'date');
        ret.usdVndRate = decToStr(ret.usdVndRate, 'vnd');
        ret.shippingRateToVn = ret.shippingRateToVn
          ? decToStr(ret.shippingRateToVn.value, ret.shippingRateToVn.currency)
          : undefined;
        ret.customTax = decToStr(ret.customTax, 'percent');
        ret.moneyReceived = decToStr(ret.moneyReceived, 'vnd');
        ret.totalBillUsd = decToStr(ret.totalBillUsd, 'usd');
        ret.actBillCost = decToStr(ret.actBillCost, 'vnd');
        ret.actCharge = decToStr(ret.actCharge, 'vnd');
        ret.comission = decToStr(ret.commission, 'vnd');
        ret.totalEstimatedWeight = decToStr(ret.totalEstimatedWeight, 'kg');
        ret.afterDiscount = decToStr(ret.afterDiscount, 'usd');
      },
    },
  }
);

billSchema.pre<IBillDocument>(/^find/, async function (next) {
  this.populate({
    path: 'customer',
    select: 'firstName lastName _id',
  });
  this.populate({
    path: 'affiliate',
    select: 'firstName lastName _id profile.commissionRates',
  });
  this.populate({
    path: 'items',
    select: 'name quantity pricePerItem estWgtPerItem usShippingFee website',
  });
  next();
});

billSchema.pre('save', async function (next) {
  const items = await Item.find({
    _id: {
      $in: this.items.map((item: any) =>
        Types.ObjectId(item._id ? item._id : item)
      ),
    },
  }).select(
    'pricePerItem quantity tax usShippingFee estWgtPerItem extraShippingCost website'
  );

  //TODO: Handle case when delete last item in bill

  const customer = await User.findById(this.customer).select(
    'profile.discountRates'
  );

  let totalBillUsd = 0;
  let totalEstWgt = 0;
  let totalShippingExtra = 0;
  let afterDiscount = 0;

  items.forEach((item) => {
    let {
      usShippingFee,
      quantity,
      pricePerItem,
      estWgtPerItem,
      extraShippingCost,
      website,
    } = item;
    usShippingFee = parseFloat(usShippingFee.toString());
    quantity = parseFloat(quantity.toString());
    pricePerItem = parseFloat(pricePerItem.toString());
    estWgtPerItem = parseFloat(estWgtPerItem.toString());
    extraShippingCost = parseFloat(extraShippingCost.toString());

    totalShippingExtra =
      Math.round(totalShippingExtra * MUL + extraShippingCost * MUL) / MUL;

    totalBillUsd =
      Math.round(
        totalBillUsd * MUL +
          usShippingFee * MUL +
          MUL *
            pricePerItem *
            quantity *
            (1 + parseFloat(this.customTax!.toString()))
      ) / MUL;

    if (!customer) {
      throw new AppError('no customter found', 404);
    }

    const discountRate =
      parseFloat(
        customer.profile
          .discountRates!.find((rate) => rate.website === website)!
          .rate.toString()
      ) || 0.08;

    afterDiscount =
      Math.round(
        afterDiscount * MUL +
          usShippingFee * MUL +
          MUL * pricePerItem * quantity * (1 - discountRate) +
          MUL *
            parseFloat(this.customTax!.toString()) *
            (usShippingFee + pricePerItem * quantity)
      ) / MUL;
    totalEstWgt =
      Math.round(totalEstWgt * MUL + estWgtPerItem * quantity * MUL) / MUL;
    // console.log(totalBillUsd, parseFloat(this.customTax?.toString()));
  });

  let shippingFeeToVn;
  if (this.shippingRateToVn.currency === 'usd') {
    shippingFeeToVn =
      Math.round(
        totalEstWgt * MUL * parseFloat(this.shippingRateToVn.value.toString())
      ) / MUL;
  } else {
    shippingFeeToVn =
      Math.round(
        totalEstWgt *
          MUL *
          parseFloat(this.shippingRateToVn.value.toString()) *
          parseFloat(this.usdVndRate.toString())
      ) / MUL;
  }

  totalBillUsd =
    Math.round(
      totalBillUsd * MUL + shippingFeeToVn * MUL + totalShippingExtra * MUL
    ) / MUL;

  this.totalEstimatedWeight = totalEstWgt;
  this.totalBillUsd = totalBillUsd;
  this.afterDiscount = afterDiscount;
  this.actCharge =
    Math.round(MUL * parseFloat(this.usdVndRate.toString()) * totalBillUsd) /
    MUL;
  next();
});

billSchema.statics.pay = async function (_id, amount) {
  if (!amount || amount < 0) {
    throw new AppError('Please double check the amount paid!', 400);
  }
  const bill = await this.findOne({ _id }).select(
    'moneyReceived actCharge status -customer'
  );
  // console.log(bill);
  // console.log(bill?.affiliate.profile.commissionRates[0]);

  if (bill?.status === 'fully-paid') {
    throw new AppError('Bill already paid', 400);
  }

  // update moneyReceived
  const moneyReceived =
    Math.round(
      parseFloat(bill!.moneyReceived.toString()) * MUL +
        parseFloat(amount) * MUL
    ) / MUL;

  const promises = [];

  // create commisson if fully paid
  if (moneyReceived >= parseFloat(bill!.actCharge.toString())) {
    promises.push(
      Commission.create({
        bill: _id,
        affiliate: bill?.affiliate._id,
        amount:
          Math.round(
            parseFloat(bill!.actCharge.toString()) *
              MUL *
              parseFloat(
                bill!.affiliate!.profile.commissionRates![0].rate.toString()
              )
          ) / MUL,
      })
    );
  }
  const newBill = this.findOneAndUpdate(
    { _id },
    {
      $set: {
        moneyReceived,
        status:
          moneyReceived >= parseFloat(bill!.actCharge.toString())
            ? 'fully-paid'
            : 'partially-paid',
      },
    },
    { returnOriginal: false }
  );

  promises.push(newBill);
  promises.push(
    Transaction.create({
      toAcct: '604fd95ca213d706709c716b',
      amountRcved: {
        value: amount,
        currency: 'vnd',
      },
      bill: _id,
    })
  );
  await Promise.all(promises as any);
  console.log(moneyReceived);
  return newBill;
};

// billSchema.methods.calcBill = calcBill;

export default billSchema;
