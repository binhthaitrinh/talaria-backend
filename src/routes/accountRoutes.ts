import express from "express";
import { createAccount, getAccounts } from "../controllers/accountsController";

const accountRouter = express.Router();

accountRouter.post("/", createAccount);
accountRouter.get("/", getAccounts);

export default accountRouter;
