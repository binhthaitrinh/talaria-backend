import express from "express";
import {
  createItem,
  getItem,
  getItems,
  updateItem,
  deleteItem,
  buy,
} from "../controllers/itemController";

const itemRouter = express.Router();

itemRouter.route("/").get(getItems).post(createItem);

itemRouter.route("/:id").get(getItem).patch(updateItem).delete(deleteItem);

itemRouter.route("/:id/:accountId").patch(buy);

export default itemRouter;
