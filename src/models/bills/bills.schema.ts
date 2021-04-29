import { Types, Schema } from 'mongoose';
import { IBillDocument, IBillModel } from './bills.types';
import { SHIPPING_RATE_VND, USD_VND_RATE } from '../../constants';
import { decToStr } from '../../utils';
import { calcBill } from './bills.methods';
import { Item } from '../items/items.model';

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
  this.populate({ path: 'items', select: 'name quantity pricePerItem' });
  next();
});

billSchema.pre<IBillDocument>('save', async function (next) {
  const items = await Item.find({
    _id: {
      $in: this.items.map((itemId) => Types.ObjectId(itemId)),
    },
  });
  console.log(items);
  next();
});

billSchema.methods.calcBill = calcBill;

export default billSchema;
