import { Schema } from "mongoose";
import validator from "validator";
import { IUser } from "./users.types";

const userSchema = new Schema({
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

export default userSchema;
