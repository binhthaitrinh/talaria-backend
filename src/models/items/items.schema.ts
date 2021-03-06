import { Schema, Types } from 'mongoose';
import { IItemModel, IItemDocument } from './items.types';
import { buy } from './items.statics';
import { decToStr } from '../../utils';
import { Bill } from '../bills/bills.model';
import AppError from '../../utils/AppError';

const itemSchema = new Schema<IItemDocument, IItemModel>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    name: {
      type: String,
      required: [true, 'An item must have a name'],
    },
    link: {
      type: String,
      required: [true, 'An item must have a link'],
    },
    pricePerItem: {
      type: Types.Decimal128,
      required: [true, 'An item must have a price'],
      get: (v: Types.Decimal128) => parseFloat(v.toString()),
    },
    actPricePerItem: {
      type: Types.Decimal128,
      get: (v: Types.Decimal128) => (v ? parseFloat(v.toString()) : null),
    },
    quantity: {
      type: Number,
      default: 1,
    },
    tax: {
      type: Types.Decimal128,
      default: 0.0,

      get: (v: Types.Decimal128) => parseFloat(v.toString()),
    },
    usShippingFee: {
      type: Types.Decimal128,
      default: 0.0,
      get: (v: Types.Decimal128) => parseFloat(v.toString()),
    },
    extraShippingCost: {
      type: Types.Decimal128,
      default: 0.0,
      get: (v: Types.Decimal128) => parseFloat(v.toString()),
    },
    estWgtPerItem: {
      type: Types.Decimal128,
      required: [true, 'An item must have its weight'],
      get: (v: Types.Decimal128) => parseFloat(v.toString()),
    },
    actWgtPerItem: {
      type: Types.Decimal128,
      default: 0.0,
      get: (v: Types.Decimal128) => parseFloat(v.toString()),
    },

    actualCost: Types.Decimal128,
    trackingLink: String,
    invoiceLink: String,
    orderDate: Date,
    arrvlAtWarehouseDate: Date,
    shippingToVnDate: Date,
    arrvlAtVnDate: Date,
    customerRcvDate: Date,
    returnDate: Date,
    returnArrvlDate: Date,
    notes: String,
    status: {
      type: String,
      enum: [
        'not-yet-ordered',
        'ordered',
        'on-the-way-to-warehouse',
        'on-the-way-to-viet-nam',
        'done',
        'returning',
        'retunred',
        'lost',
        'in-inventory',
      ],
      default: 'not-yet-ordered',
    },
    website: {
      type: String,
      enum: [
        'amazon',
        'sephora',
        'bestbuy',
        'walmart',
        'target',
        'costco',
        'others',
      ],
      default: 'amazon',
    },
    commissionRate: Types.Decimal128,
    itemType: {
      type: String,
      enum: ['cosmetics', 'toys', 'others', 'electronics', 'accessories'],
      default: 'others',
    },
    customId: {
      type: String,
      // unique: true
    },
    orderAccount: {
      type: Types.ObjectId,
      ref: 'Account',
    },
    warehouse: {
      type: Types.ObjectId,
      ref: 'Warehouse',
    },
    transaction: {
      type: Types.ObjectId,
      ref: 'Transaction',
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.usShippingFee = decToStr(ret.usShippingFee, 'usd');
        ret.tax = decToStr(ret.tax, 'percent');
        ret.extraShippingCost = decToStr(ret.extraShippingCost, 'usd');
        ret.actWgtPerItem = decToStr(ret.actWgtPerItem, 'kg');
        ret.pricePerItem = decToStr(ret.pricePerItem, 'usd');
        ret.actualCost = decToStr(ret.actualCost, 'vnd');
        ret.estWgtPerItem = decToStr(ret.estWgtPerItem, 'kg');
        ret.commissionRate = decToStr(ret.commissionRate, 'percent');
        ret.actPricePerItem = decToStr(ret.actPricePerItem, 'usd');
        ret.createdAt = decToStr(ret.createdAt, 'date');
        ret.updatedAt = decToStr(ret.updatedAt, 'date');
        ret.orderDate = decToStr(ret.orderDate, 'date');
        ret.arrvlAtWarehouseDate = decToStr(ret.arrvlAtWarehouseDate, 'date');
        ret.shippingToVnDate = decToStr(ret.shippingToVnDate, 'date');
        ret.arrvlAtVnDate = decToStr(ret.arrvlAtVnDate, 'date');
        ret.customerRcvDate = decToStr(ret.customerRcvDate, 'date');
        ret.returnDate = decToStr(ret.returnDate, 'date');
        ret.returnArrvlDate = decToStr(ret.returnArrvlDate, 'date');
        return ret;
      },
      virtuals: true,
    },
  }
);

itemSchema.pre<IItemDocument>('save', async function (next) {
  this.actPricePerItem = this.pricePerItem;
  next();
});

itemSchema.post<IItemModel>(/^findOneAnd/, async function (next) {
  const item = await this.findOne();

  const bills = await Bill.find({
    items: { $elemMatch: { $eq: Types.ObjectId(item!._id) } },
  });
  const promises: any[] = [];
  bills.forEach((bill) => promises.push(bill.save()));
  try {
    await Promise.all(promises);
  } catch (err) {
    return next(err);
  }
});

itemSchema.pre<IItemModel>(/^findOneAndDelete/, async function (next) {
  const item = await this.findOne();
  const bills = await Bill.find({
    items: { $elemMatch: { $eq: Types.ObjectId(item!._id) } },
  });
  if (bills.length !== 0) {
    bills.forEach((bill) => {
      if (bill.items.length >= 1) {
        return next(
          new AppError(
            'the bill containing this items is not empty. Delete failed',
            400
          )
        );
      }
    });
  }
});
itemSchema.statics.buy = buy;

export default itemSchema;
