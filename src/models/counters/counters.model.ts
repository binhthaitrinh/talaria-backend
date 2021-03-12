import { model } from "mongoose";
import counterSchema from "./counters.schema";
import { ICounterDocument } from "./counters.types";

export const Counter = model<ICounterDocument>("Counter", counterSchema);
