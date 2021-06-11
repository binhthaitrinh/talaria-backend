import { NextFunction, Request, Response } from 'express';
import { Transaction } from '../models/transaction/transactions.model';
import { catchAsync } from '../utils/catchAsync';
import * as factory from './handleFactory';

export const createTransaction = factory.createOne(Transaction);
export const getTransactions = factory.getAll(Transaction);
export const getTransaction = factory.getOne(Transaction);
export const updateTransaction = factory.updateOne(Transaction);
export const deleteTransaction = factory.deleteOne(Transaction);

export const getTransactionOnAcct = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { accountId } = req.params;

    const transactions = await Transaction.find({
      $or: [{ toAcct: accountId }, { fromAcct: accountId }],
    }).sort('-_id -createdAt');

    return res.status(200).json({
      status: 'success',
      data: {
        data: transactions,
      },
    });
  }
);
