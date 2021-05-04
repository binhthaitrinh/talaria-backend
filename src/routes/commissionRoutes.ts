import express from 'express';

import {
  getCommission,
  getCommissions,
  createCommission,
  updateCommission,
  deleteCommission,
  getMonthlyCommissions,
  payCommission,
} from '../controllers/commissionController';

const commissionRouter = express.Router();

commissionRouter
  .route('/:id/:year/:month')
  .get(getMonthlyCommissions)
  .patch(payCommission);

commissionRouter.route('/').get(getCommissions).post(createCommission);

commissionRouter
  .route('/:id')
  .get(getCommission)
  .patch(updateCommission)
  .delete(deleteCommission);

export default commissionRouter;
