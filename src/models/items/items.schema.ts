import { Schema, Types } from "mongoose";
import { IItemModel, IItemDocument } from "./items.types";

const itemSchema = new Schema<IItemDocument, IItemModel>({
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
  },
  actPricePerItem: Types.Decimal128,
  quantity: {
    type: Number,
    required: [true, "There must be quantity associated"],
  },
  tax: {
    type: Types.Decimal128,
    default: 0.0,
  },
  usShippingFee: {
    type: Types.Decimal128,
    default: 0.0,
  },
  extraShippingCost: {
    type: Types.Decimal128,
    default: 0.0,
  },
  estWgtPerItem: {
    type: Types.Decimal128,
    required: [true, "An item must have its weight"],
  },
  actWgtPerItem: {
    type: Types.Decimal128,
    default: 0.0,
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
    enum: ["cosmetics", "toys", "others"],
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
});

export default itemSchema;
