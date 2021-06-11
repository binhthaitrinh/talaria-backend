import { NextFunction, Request, Response } from 'express';
import { Account } from '../models/accounts/accounts.model';
import { Bill } from '../models/bills/bills.model';
import { Commission } from '../models/commissions/commissions.model';
import { catchAsync } from '../utils/catchAsync';

export const getStats = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const accounts = await Account.find({
      name: { $in: ['USD_ACCOUNT', 'VND_ACCOUNT'] },
    });

    const bills = await Bill.find().sort('-_id -createdAt').limit(8);

    const commissions = await Commission.find()
      .sort('-_id -createdAt')
      .limit(8);

    res.status(200).json({
      status: 'success',
      data: {
        accounts,
        bills,
        commissions,
      },
    });
  }
);
