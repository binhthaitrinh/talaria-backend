import { Schema, Types } from "mongoose";
import { IItemModel, IItemDocument } from "./items.types";
import { buy } from "./items.statics";
import { decToNum } from "../../utils";

const itemSchema = new Schema<IItemDocument, IItemModel>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    name: {
      type: String,
      required: [true, "An item must have a name"],
    },
    link: {
      type: String,
      required: [true, "An item must have a link"],
    },
    pricePerItem: {
      type: Types.Decimal128,
      required: [true, "An item must have a price"],
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
      required: [true, "An item must have its weight"],
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
        "not-yet-ordered",
        "ordered",
        "on-the-way-to-warehouse",
        "on-the-way-to-viet-nam",
        "done",
        "returning",
        "retunred",
        "lost",
        "in-inventory",
      ],
      default: "not-yet-ordered",
    },
    website: {
      type: String,
      enum: [
        "amazon",
        "sephora",
        "bestbuy",
        "walmart",
        "target",
        "costco",
        "others",
      ],
      default: "amazon",
    },
    commissionRate: Types.Decimal128,
    itemType: {
      type: String,
      enum: ["cosmetics", "toys", "others", "electronics", "accessories"],
      default: "others",
    },
    customId: {
      type: String,
      // unique: true
    },
    orderAccount: {
      type: Types.ObjectId,
      ref: "Account",
    },
    warehouse: {
      type: Types.ObjectId,
      ref: "Warehouse",
    },
    transaction: {
      type: Types.ObjectId,
      ref: "Transaction",
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.usShippingFee = decToNum(ret.usShippingFee);
        ret.tax = decToNum(ret.tax);
        ret.extraShippingCost = decToNum(ret.extraShippingCost);
        ret.actWgtPerItem = decToNum(ret.actWgtPerItem);
        ret.pricePerItem = decToNum(ret.pricePerItem);
        ret.actualCost = decToNum(ret.actualCost);
        ret.estWgtPerItem = decToNum(ret.estWgtPerItem);
        return ret;
      },
    },
  }
);

// itemSchema.pre<IItemDocument>("save", async function (next) {
//   this.actPricePerItem = this.pricePerItem;
//   next();
// });

itemSchema.statics.buy = buy;

export default itemSchema;
