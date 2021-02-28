import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB = process.env.MONGO_URI?.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD as string
);

mongoose
  .connect(DB as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((conn) => console.log("DB connection successful..."))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4444;
