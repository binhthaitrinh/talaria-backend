import express from 'express';
import {
  createBill,
  getBills,
  getBill,
  updateBill,
  deleteBill,
  pay,
} from '../controllers/billController';

const billRouter = express.Router();

billRouter.route('/').get(getBills).post(createBill);

billRouter.route('/:id').get(getBill).patch(updateBill).delete(deleteBill);

billRouter.patch('/:id/pay', pay);

export default billRouter;
