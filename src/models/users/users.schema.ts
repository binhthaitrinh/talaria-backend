import { Schema } from "mongoose";
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
  role: {
    type: String,
    enum: ["user", "admin", "moderator", "affiliate"],
    default: "user",
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
