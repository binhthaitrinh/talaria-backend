import { model } from "mongoose";
import cryptoSchema from "./crypto.schema";
import { ICryptoDocument } from "./crypto.types";

export const Crypto = model<ICryptoDocument>("Crypto", cryptoSchema);
