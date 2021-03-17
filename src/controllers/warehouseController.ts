import { Warehouse } from "../models/warehouses/warehouses.model";
import * as factory from "./handleFactory";

export const createWarehouse = factory.createOne(Warehouse);
export const getWarehouses = factory.getAll(Warehouse);
export const getWarehouse = factory.getOne(Warehouse);
export const updateWarehouse = factory.updateOne(Warehouse);
export const deleteWarehouse = factory.deleteOne(Warehouse);
