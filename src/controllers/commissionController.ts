import { Types } from 'mongoose';
import { MUL } from '../constants';
import { Commission } from '../models/commissions/commissions.model';
import { Transaction } from '../models/transaction/transactions.model';
import { decToStr } from '../utils';
import AppError from '../utils/AppError';
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

export const getMonthlyCommissions = catchAsync(
  async (req: any, res: any, _next: any) => {
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

    docs.forEach((doc) => {
      doc.createdAt = decToStr(doc.createdAt, 'date');
      doc.amount = decToStr(doc.amount, 'vnd');
    });

    res.status(200).json({
      status: 'success',
      data: {
        data: docs,
      },
    });
  }
);

export const payCommission = catchAsync(
  async (req: any, res: any, next: any) => {
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
            $ne: 'paid',
          },
          affiliate: Types.ObjectId(req.params.id),
        },
      },
    ]);

    console.log(commissions);
    if (commissions.length === 0) {
      return next(new AppError('Commissions already paid!', 400));
    }

    let totalAmount = 0;

    commissions.forEach((commission) => {
      totalAmount =
        Math.round(
          totalAmount * MUL + parseFloat(commission.amount.toString()) * MUL
        ) / MUL;
    });

    const promises: any[] = [];

    promises.push(
      Transaction.create({
        fromAcct: '604fd95ca213d706709c716b',
        amountSent: {
          value: totalAmount,
          currency: 'vnd',
        },
        affiliate: req.params.id,
        bill: commissions[0].bill,
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
  }
);

export const paySingle = catchAsync(async (req: any, res: any, next: any) => {
  const { amount } = req.body;
  const commission = await Commission.findById(req.params.id);

  if (!commission) {
    return next(new AppError('No commission found with that ID', 400));
  }

  if (parseFloat(amount) < parseFloat(commission.amount.toString())) {
    return next(new AppError('Must pay full amount', 400));
  }

  if (commission.status === 'paid') {
    return next(new AppError('commission already paid', 400));
  }

  await Transaction.create({
    fromAcct: '604fd95ca213d706709c716b',
    amountSent: {
      value: amount,
      currency: 'vnd',
    },
    affiliate: commission.affiliate,
    bill: commission.bill,
  });

  await Commission.findByIdAndUpdate(req.params.id, { status: 'paid' });

  res.status(200).json({
    status: 'success',
    data: {
      paidAmount: amount,
    },
  });
});
