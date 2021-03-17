import { model } from "mongoose";
import itemSchema from "./items.schema";
import { IItemDocument } from "./items.types";

export const Item = model<IItemDocument>("Item", itemSchema);
