import express from "express";
import {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/accountsController";

const accountRouter = express.Router();

accountRouter.route("/").get(getAccounts).post(createAccount);
accountRouter
  .route("/:id")
  .get(getAccount)
  .patch(updateAccount)
  .delete(deleteAccount);

export default accountRouter;
