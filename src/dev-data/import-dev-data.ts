import mongoose from "mongoose";
import dotenv from "dotenv";
import { Account } from "../models/accounts/accounts.model";
// import { User } from "../models/users/users.model";
import { Crypto } from "../models/crypto/crypto.model";
import fs from "fs";
import { Giftcard } from "../models/giftcards/giftcard.model";

dotenv.config({ path: `${__dirname}/../../.env` });

const accounts = JSON.parse(
  fs.readFileSync(`${__dirname}/accounts.json`, "utf-8")
);

const DB: string = <string>(
  process.env.MONGO_URI?.replace(
    "<PASSWORD>",
    process.env.MONGO_PASSWORD as string
  )
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((_) => console.log("DB connection successful..."))
  .catch((err) => console.log(err));

const deleteData = async () => {
  try {
    // await Account.deleteMany();
    // await User.deleteMany();
    if (process.argv[3] === "--cryptos") {
      await Crypto.deleteMany();
    }
    if (process.argv[3] === "--giftcards") {
      await Giftcard.deleteMany();
    }
    console.log("DELETE SUCCESSFUL");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const importData = async () => {
  try {
    if (process.argv[3] === "--accounts") {
      await Account.create(accounts);
      console.log("Accounts successfully loaded");
    }
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--delete") {
  deleteData();
} else if (process.argv[2] === "--import") {
  importData();
}
