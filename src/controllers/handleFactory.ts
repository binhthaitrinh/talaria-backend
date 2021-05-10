import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { Model, QueryOptions } from 'mongoose';
import AppError from '../utils/AppError';
import APIFeatures from '../utils/APIFeatures';
// import { getNextSequence } from '../utils/getNextSequence';

export const createOne = (Model: Model<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const name = Model.collection.collectionName.slice(
    //   0,
    //   Model.collection.collectionName.length - 1
    // );
    // const nextId = await getNextSequence(name, next);
    const doc = await Model.create({
      ...req.body,
      // customId: `${name}-${nextId}`,
    });

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

export const getOne = (Model: Model<any>, options?: QueryOptions) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);

    if (options) query = query.populate(options);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

export const getAll = (Model: Model<any>, options?: any) => {
  return catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const features = new APIFeatures(Model.find(options || {}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const count = new APIFeatures(Model.find(options || {}), req.query)
        .filter()
        .sort()
        .limitFields();

      const docs = await features.query;

      const counts = await count.query;

      res.status(200).json({
        status: 'success',
        data: {
          totalCount: counts.length,
          data: docs,
        },
      });
    }
  );
};

export const deleteOne = (Model: Model<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    console.log('deleted');

    res.status(200).json({ status: 'success', data: null });
  });
};

export const updateOne = (Model: Model<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(
        new AppError('No document found with that ID. Update failed', 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};
