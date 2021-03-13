import { model } from "mongoose";
import affiliateSchema from "./affiliates.schema";
import { IAffiliateDocument } from "./affiliates.types";

export const Affiliate = model<IAffiliateDocument>(
  "Affiliate",
  affiliateSchema
);
