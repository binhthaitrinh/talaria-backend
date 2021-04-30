import { Types, Schema } from 'mongoose';
import { IBillDocument, IBillModel } from './bills.types';
import { MUL, SHIPPING_RATE_VND, USD_VND_RATE } from '../../constants';
import { decToStr } from '../../utils';
import { calcBill } from './bills.methods';
import { Item } from '../items/items.model';
import { User } from '../users/users.model';

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
      required: [true, 'There must be an affilaite associated with this bill'],
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.createdAt = decToStr(ret.createdAt, 'date');
        ret.updatedAt = decToStr(ret.updatedAt, 'date');
        ret.usdVndRate = decToStr(ret.usdVndRate, 'vnd');
        ret.shippingRateToVn = decToStr(
          ret.shippingRateToVn.value,
          ret.shippingRateToVn.currency
        );
        ret.customTax = decToStr(ret.customTax, 'percent');
        ret.moneyReceived = decToStr(ret.moneyReceived, 'vnd');
        ret.totalBillUsd = decToStr(ret.totalBillUsd, 'usd');
        ret.actBillCost = decToStr(ret.actBillCost, 'vnd');
        ret.actCharge = decToStr(ret.actCharge, 'vnd');
        ret.comission = decToStr(ret.commission, 'vnd');
      },
    },
  }
);

billSchema.pre<IBillDocument>(/^find/, async function (next) {
  this.populate({ path: 'customer', select: 'firstName lastName _id' });
  this.populate({ path: 'affiliate', select: 'firstName lastName _id' });
  this.populate({
    path: 'items',
    select: 'name quantity pricePerItem',
  });
  next();
});

billSchema.pre('save', async function (next) {
  console.log('chaging');
  const items = await Item.find({
    _id: {
      $in: this.items.map((itemId) => Types.ObjectId(itemId._id)),
    },
  }).select(
    'pricePerItem quantity tax usShippingFee estWgtPerItem extraShippingCost website'
  );

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

    const discountRate = parseFloat(
      customer?.profile.discountRates
        ?.find((rate) => rate.website === website)
        ?.rate.toString()
    );
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
    console.log(totalBillUsd, parseFloat(this.customTax?.toString()));
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

  console.log(totalBillUsd);
  totalBillUsd =
    Math.round(
      totalBillUsd * MUL + shippingFeeToVn * MUL + totalShippingExtra * MUL
    ) / MUL;
  console.log(afterDiscount);

  this.totalEstimatedWeight = totalEstWgt;
  this.totalBillUsd = totalBillUsd;
  this.afterDiscount = afterDiscount;
  this.actCharge =
    Math.round(MUL * parseFloat(this.usdVndRate.toString()) * totalBillUsd) /
    MUL;
  next();
});

// billSchema.methods.calcBill = calcBill;

export default billSchema;
