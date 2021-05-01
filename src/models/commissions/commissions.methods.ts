import { model } from 'mongoose';
import commissionSchema from './commissions.schema';
import { IComissionDocument, ICommissionModel } from './commissions.types';

export const Commission = model<IComissionDocument, ICommissionModel>(
  'Commission',
  commissionSchema
);
