import { Bill } from "../models/bills/bills.model";
import * as factory from "./handleFactory";

export const createBill = factory.createOne(Bill);
export const getBills = factory.getAll(Bill);
export const getBill = factory.getOne(Bill);
export const updateBill = factory.updateOne(Bill);
export const deleteBill = factory.deleteOne(Bill);
