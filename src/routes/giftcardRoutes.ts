import express from "express";
import {
  createGiftcard,
  getGiftcard,
  getGiftcards,
  updateGiftcard,
  deleteGiftcard,
} from "../controllers/giftcardController";

const giftcardRouter = express.Router();

giftcardRouter.route("/").get(getGiftcards).post(createGiftcard);

giftcardRouter
  .route("/:id")
  .get(getGiftcard)
  .patch(updateGiftcard)
  .delete(deleteGiftcard);

export default giftcardRouter;
