import { model } from "mongoose";
import warehouseSchema from "./warehouses.schema";
import { IWarehouseDocument } from "./warehouses.types";

export const Warehouse = model<IWarehouseDocument>(
  "Warehouse",
  warehouseSchema
);
