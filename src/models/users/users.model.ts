import { model } from "mongoose";
import userSchema from "./users.schema";
import { IUserDocument } from "./users.types";

export const User = model<IUserDocument>("User", userSchema);
