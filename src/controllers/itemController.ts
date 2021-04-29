import { Item } from '../models/items/items.model';
import * as factory from './handleFactory';
import { catchAsync } from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

export const createItem = factory.createOne(Item);
export const getItems = factory.getAll(Item);
export const getItem = factory.getOne(Item);
export const deleteItem = factory.deleteOne(Item);
export const updateItem = factory.updateOne(Item);
export const buy = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const item = await Item.buy(req.params.id, req.params.accountId);
    res.status(200).json({
      status: 'success',
      data: {
        data: item,
      },
    });
  }
);
