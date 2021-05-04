import { Types } from 'mongoose';
import { MUL } from '../constants';
import { Commission } from '../models/commissions/commissions.model';
import { Transaction } from '../models/transaction/transactions.model';
import { catchAsync } from '../utils/catchAsync';
import * as factory from './handleFactory';

export const createCommission = factory.createOne(Commission);
export const getCommissions = factory.getAll(Commission);
export const deleteCommission = factory.deleteOne(Commission);
export const updateCommission = factory.updateOne(Commission);
export const getCommission = factory.getOne(Commission);

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export const getMonthlyCommissions = catchAsync(async (req, res, next) => {
  const month = req.params.month * 1;
  const year = req.params.year * 1;
  console.log(month, year);
  const docs = await Commission.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-${getDaysInMonth(month, year)}`),
        },
        affiliate: Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: 'bills',
        localField: 'bill',
        foreignField: '_id',
        as: 'bill',
      },
    },
    {
      $unwind: '$bill',
    },
    {
      $project: {
        createdAt: 1,
        status: 1,
        'bill._id': 1,
        amount: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: docs,
    },
  });
});

export const payCommission = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const month = req.params.month * 1;
  const commissions = await Commission.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-${getDaysInMonth(month, year)}`),
        },
        status: {
          $eq: 'pending',
        },
        affiliate: Types.ObjectId(req.params.id),
      },
    },
  ]);

  console.log(commissions);

  let totalAmount = 0;

  commissions.forEach((commission) => {
    totalAmount =
      Math.round(
        totalAmount * MUL + parseFloat(commission.amount.toString()) * MUL
      ) / MUL;
  });

  const promises = [];

  promises.push(
    Transaction.create({
      fromAcct: '604fd95ca213d706709c716b',
      amountSent: {
        value: totalAmount,
        currency: 'vnd',
      },
      affiliate: req.params.id,
    })
  );

  const ids = commissions.map((com) => com._id);
  promises.push(
    Commission.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          status: 'paid',
        },
      }
    )
  );

  await Promise.all(promises);

  console.log(totalAmount);

  res.status(200).json({
    status: 'success',
    data: {
      paidAmount: totalAmount,
    },
  });
});
