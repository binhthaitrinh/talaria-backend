import { Schema } from "mongoose";
import { kStringMaxLength } from "node:buffer";
import { IWarehouseDocument, IWarehouseModel } from "./warehouses.types";

const warehouseSchema = new Schema<IWarehouseDocument, IWarehouseModel>({
  name: {
    type: String,
    required: [true, "A warehouse must have a name"],
  },
  address1: {
    type: String,
    required: [true, "A warehouse must have address"],
  },
  address2: String,
  city: {
    type: String,
    required: [true, "A warehouse must have a city"],
  },
  state: {
    type: String,
    required: [true, "A warehouse must have a state"],
  },
  zipcode: {
    type: String,
    required: [true, "A warehouse must have a zipcode"],
  },
  phone: String,
  notes: String,
  customId: {
    type: String,
    // unique: true,
  },
});

export default warehouseSchema;
