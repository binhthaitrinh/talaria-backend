import express from "express";
import {
  createCrypto,
  getCrypto,
  getCryptos,
  updateCrypto,
  deleteCrypto,
} from "../controllers/cryptoController";

const cryptoRouter = express.Router();

cryptoRouter.route("/").get(getCryptos).post(createCrypto);
cryptoRouter
  .route("/:id")
  .get(getCrypto)
  .patch(updateCrypto)
  .delete(deleteCrypto);

export default cryptoRouter;
