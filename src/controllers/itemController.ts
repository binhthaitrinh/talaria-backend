import { Item } from "../models/items/items.model";
import * as factory from "./handleFactory";

export const createItem = factory.createOne(Item);
export const getItems = factory.getAll(Item);
export const getItem = factory.getOne(Item);
export const deleteItem = factory.deleteOne(Item);
export const updateItem = factory.updateOne(Item);
