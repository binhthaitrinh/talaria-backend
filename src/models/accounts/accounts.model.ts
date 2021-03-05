import { model } from "mongoose";
import accountSchema from "./accounts.schema";
import { IAcctDocument } from "./accounts.types";

export const Account = model<IAcctDocument>("Account", accountSchema);
