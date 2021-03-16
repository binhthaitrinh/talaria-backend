import { model } from "mongoose";
import giftcardSchema from "./giftcard.schema";
import { IGiftcardDocument } from "./giftcard.types";

export const Giftcard = model<IGiftcardDocument>("Giftcard", giftcardSchema);
