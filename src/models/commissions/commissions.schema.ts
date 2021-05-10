import { Schema, Types } from 'mongoose';
import { decToStr } from '../../utils';
import { IComissionDocument, ICommissionModel } from './commissions.types';

const commissionSchema = new Schema<IComissionDocument, ICommissionModel>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    bill: {
      type: Types.ObjectId,
      ref: 'Bill',
    },
    affiliate: {
      type: Types.ObjectId,
      ref: 'Affiliate',
    },
    amount: {
      type: Types.Decimal128,
      required: [true, 'A commission must have amount'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'partially-paid'],
      default: 'pending',
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.createdAt = decToStr(ret.createdAt, 'date');
        return ret;
      },
    },
  }
);

export default commissionSchema;
