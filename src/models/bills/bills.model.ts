import { model } from "mongoose";
import billSchema from "./bills.schema";
import { IBillDocument, IBillModel } from "./bills.types";

export const Bill = model<IBillDocument, IBillModel>("Bill", billSchema);
