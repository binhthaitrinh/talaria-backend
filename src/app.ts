import express from "express";
import { User } from "./models/users/users.model";

const app = express();

app.use(express.json());

app.get("/", async (_req, res, _next) => {
  try {
    const newUser = await User.create({
      firstName: "binh",
      lastName: "trinh",
      email: "trinhthaibinh.ecom@gmail.com",
      password: "binhbinh",
      passwordConfirm: "binhbinh",
    });
    console.log(newUser);
  } catch (err) {
    console.log(err);
  }
  res.send("Hello");
});

export default app;
