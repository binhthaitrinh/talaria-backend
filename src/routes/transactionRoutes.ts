import express from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactionOnAcct,
  getTransactions,
  updateTransaction,
} from '../controllers/transactionsController';

const transactionRouter = express.Router();
transactionRouter.get('/account/:accountId', getTransactionOnAcct);

transactionRouter.route('/').get(getTransactions).post(createTransaction);

transactionRouter
  .route('/:id')
  .get(getTransaction)
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default transactionRouter;
