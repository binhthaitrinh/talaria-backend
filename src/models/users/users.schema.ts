import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { IUser, IUserDocument, IUserModel } from "./users.types";
import bcrypt from "bcrypt";
import { comparePassword } from "./users.methods";

const userSchema = new Schema<IUserDocument, IUserModel>({
  firstName: {
    type: String,
    required: [true, "User must have a first name"],
  },
  lastName: String,
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide your confirm password"],
    minLength: 8,
    validate: {
      validator: function (this: IUser, el: string): boolean {
        return el === this.password;
      },
      message:
        "Please ensure that the password and confirm password is the same",
    },
  },
  passwordChangedAt: Date,
  // passwordResetToken: String,
  // passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  customId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  notes: String,
  role: {
    type: String,
    enum: ["admin", "affiliate", "customer"],
    default: "customer",
  },
  profile: {
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
    phoneNumbers: [String],
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
    commissionRates: {
      type: [
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

      // validate: {
      //   validator: function (this: IUser, el: any) {
      //     console.log(el);
      //     console.log(this.role);
      //   },
      // },
    },
    dob: Date,
    customerType: {
      type: String,
      enum: ["wholesale", "personal"],
      default: "personal",
    },
    address: [
      {
        streetAddr: {
          type: String,
          required: [true, "There must be a street address"],
        },
        city: {
          type: String,
          required: [true, "There must be a city"],
        },
      },
    ],
    discountRates: [
      {
        website: {
          type: String,
          required: [true, "discount rate must be specified for a website"],
        },
        rate: {
          type: mongoose.Types.Decimal128,
          default: 0.08,
        },
      },
    ],
  },
});

userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre<IUserDocument>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = comparePassword;

export default userSchema;
