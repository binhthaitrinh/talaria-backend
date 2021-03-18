import { model } from "mongoose";
import itemSchema from "./items.schema";
import { IItemDocument, IItemModel } from "./items.types";

export const Item = model<IItemDocument, IItemModel>("Item", itemSchema);
