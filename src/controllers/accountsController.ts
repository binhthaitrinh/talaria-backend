import { Account } from "../models/accounts/accounts.model";
import * as factory from "./handleFactory";

export const createAccount = factory.createOne(Account);
export const getAccounts = factory.getAll(Account);
