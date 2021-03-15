import { Crypto } from "../models/crypto/crypto.model";
import * as factory from "./handleFactory";

export const createCrypto = factory.createOne(Crypto);
export const getCryptos = factory.getAll(Crypto);
export const deleteCrypto = factory.deleteOne(Crypto);
export const updateCrypto = factory.updateOne(Crypto);
export const getCrypto = factory.getOne(Crypto);
