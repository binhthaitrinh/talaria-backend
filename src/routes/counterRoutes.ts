import express from "express";
import { Counter } from "../models/counters/counters.model";
import { createOne, getAll } from "../controllers/handleFactory";

const couterRouter = express.Router();

couterRouter.route("/").post(createOne(Counter)).get(getAll(Counter));

export default couterRouter;
