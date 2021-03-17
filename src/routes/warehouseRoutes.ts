import express from "express";
import {
  getWarehouse,
  getWarehouses,
  createWarehouse,
  deleteWarehouse,
  updateWarehouse,
} from "../controllers/warehouseController";

const warehouseRouter = express.Router();

warehouseRouter.route("/").get(getWarehouses).post(createWarehouse);
warehouseRouter
  .route("/:id")
  .get(getWarehouse)
  .patch(updateWarehouse)
  .delete(deleteWarehouse);

export default warehouseRouter;
