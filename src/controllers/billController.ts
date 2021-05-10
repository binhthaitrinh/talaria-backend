import { NextFunction, Response, Request } from 'express';
import { Bill } from '../models/bills/bills.model';
import { catchAsync } from '../utils/catchAsync';
import * as factory from './handleFactory';

export const createBill = factory.createOne(Bill);
export const getBills = factory.getAll(Bill);
export const getBill = factory.getOne(Bill);
export const updateBill = factory.updateOne(Bill);
export const deleteBill = factory.deleteOne(Bill);
export const pay = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = await Bill.pay(req.params.id, req.body.amount);

    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    });
  }
);
