import express from "express";
import { User } from "./models/users/users.model";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./controllers/errorController";
import AppError from "./utils/AppError";

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

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;
