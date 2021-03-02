import express from "express";
import { User } from "./models/users/users.model";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./controllers/errorController";

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

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export default app;
