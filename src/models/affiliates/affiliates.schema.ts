import mongoose, { Schema } from "mongoose";
import {
  IAffiliate,
  IAffiliateDocument,
  IAffiliateModel,
} from "./affiliates.types";

const affiliateSchema = new Schema<IAffiliateDocument, IAffiliateModel>({
  updatedAt: Date,
  socialMedias: [
    {
      website: {
        type: String,
        enum: ["facebook", "instagram", "zalo", "twitter", "others"],
        required: [true, "a social media must have a host"],
      },
      link: {
        type: String,
        required: [true, "a social media must have a link"],
      },
    },
  ],
  phoneNumber: [String],
  bankAccts: [
    {
      bankName: {
        type: String,
        required: [true, "a bank must have a name"],
      },
      acctNumber: {
        type: String,
        required: [true, "a bank account must have number"],
      },
      bankLocation: String,
    },
  ],
  commissionRates: [
    {
      website: {
        type: String,
        required: [true, "commission rate must be specified for a website"],
      },
      rate: {
        type: mongoose.Types.Decimal128,
        default: 0.08,
      },
    },
  ],
  dob: Date,
});

export default affiliateSchema;
