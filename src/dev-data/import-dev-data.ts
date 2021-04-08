import mongoose from "mongoose";
import dotenv from "dotenv";
import { Item } from "../models/items/items.model";
import { Account } from "../models/accounts/accounts.model";
// import { User } from "../models/users/users.model";
import { Crypto } from "../models/crypto/crypto.model";
import fs from "fs";
import { Giftcard } from "../models/giftcards/giftcard.model";

dotenv.config({ path: `${__dirname}/../../.env` });

const accounts = JSON.parse(
  fs.readFileSync(`${__dirname}/accounts.json`, "utf-8")
);

const cryptos = JSON.parse(
  fs.readFileSync(`${__dirname}/crypto.json`, "utf-8")
);

const giftcards = JSON.parse(
  fs.readFileSync(`${__dirname}/giftcard.json`, "utf-8")
);

const items = JSON.parse(fs.readFileSync(`${__dirname}/items.json`, "utf-8"));

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
    if (process.argv[3] === "--items") {
      await Item.create(items);
      console.log("items successfully loaded");
    }
    if (process.argv[3] === "--cryptos") {
      await Crypto.create(cryptos[0]);
      await Crypto.create(cryptos[1]);
      await Crypto.create(cryptos[2]);
      await Crypto.create(cryptos[3]);
      await Crypto.create(cryptos[4]);
      await Crypto.create(cryptos[5]);
      await Crypto.create(cryptos[6]);
      await Crypto.create(cryptos[7]);
      await Crypto.create(cryptos[8]);
      await Crypto.create(cryptos[9]);
      console.log("Accounts successfully loaded");
    }
    if (process.argv[3] === "--giftcards") {
      await Giftcard.create(giftcards[0]);
      await Giftcard.create(giftcards[1]);
      await Giftcard.create(giftcards[2]);
      await Giftcard.create(giftcards[3]);
      await Giftcard.create(giftcards[4]);
      await Giftcard.create(giftcards[5]);
      await Giftcard.create(giftcards[6]);
      await Giftcard.create(giftcards[7]);
      await Giftcard.create(giftcards[8]);
      await Giftcard.create(giftcards[9]);

      console.log("Giftcards successfully loaded");
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
