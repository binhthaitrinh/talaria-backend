import { Account } from "../models/accounts/accounts.model";
import * as factory from "./handleFactory";

export const createAccount = factory.createOne(Account);
export const getAccounts = factory.getAll(Account);
export const deleteAccount = factory.deleteOne(Account);
export const updateAccount = factory.updateOne(Account);
export const getAccount = factory.getOne(Account);
