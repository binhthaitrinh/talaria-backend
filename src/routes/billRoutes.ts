import express from "express";
import {
  createBill,
  getBills,
  getBill,
  updateBill,
  deleteBill,
} from "../controllers/billController";

const billRouter = express.Router();

billRouter.route("/").get(getBills).post(createBill);

billRouter.route("/:id").get(getBill).patch(updateBill).delete(deleteBill);

export default billRouter;
