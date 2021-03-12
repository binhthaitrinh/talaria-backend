import mongoose from "mongoose";
import dotenv from "dotenv";
import { Account } from "../models/accounts/accounts.model";

dotenv.config({ path: `${__dirname}/../../.env` });

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
    await Account.deleteMany();
    console.log("DELETE SUCCESSFUL");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "--delete") {
  deleteData();
}
