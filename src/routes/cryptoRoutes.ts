import express from "express";
import {
  createCrypto,
  getCrypto,
  getCryptos,
  updateCrypto,
  deleteCrypto,
} from "../controllers/cryptoController";

const accountRouter = express.Router();

accountRouter.route("/").get(getCryptos).post(createCrypto);
accountRouter
  .route("/:id")
  .get(getCrypto)
  .patch(updateCrypto)
  .delete(deleteCrypto);

export default accountRouter;
