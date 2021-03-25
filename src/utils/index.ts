import { Types } from "mongoose";
export const decToNum = (dec: Types.Decimal128) => parseFloat(dec.toString());
