import { Giftcard } from "../models/giftcards/giftcard.model";
import * as factory from "./handleFactory";

export const createGiftcard = factory.createOne(Giftcard);
export const getGiftcard = factory.getOne(Giftcard);
export const deleteGiftcard = factory.deleteOne(Giftcard);
export const updateGiftcard = factory.updateOne(Giftcard);
export const getGiftcards = factory.getAll(Giftcard);
