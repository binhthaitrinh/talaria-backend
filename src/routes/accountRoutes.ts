import express from "express";
import { createAccount } from "../controllers/accountsController";

const accountRouter = express.Router();

accountRouter.post("/", createAccount);

export default accountRouter;
