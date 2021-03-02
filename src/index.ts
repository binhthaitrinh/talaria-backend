import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

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
    useFindAndModify: true,
  })
  .then((_) => console.log("DB connection successful..."))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
