import { Schema } from 'mongoose';
import { IWarehouseDocument, IWarehouseModel } from './warehouses.types';

const warehouseSchema = new Schema<IWarehouseDocument, IWarehouseModel>({
  name: {
    type: String,
    required: [true, 'A warehouse must have a name'],
  },
  address1: {
    type: String,
    required: [true, 'A warehouse must have address'],
  },
  address2: String,
  city: {
    type: String,
    required: [true, 'A warehouse must have a city'],
  },
  state: {
    type: String,
    required: [true, 'A warehouse must have a state'],
  },
  zipcode: {
    type: String,
    required: [true, 'A warehouse must have a zipcode'],
  },
  phone: String,
  notes: String,
  deliveredTo: {
    type: String,
    enum: ['ha noi', 'ho chi minh'],
    required: [true, 'A warehouse must have location'],
  },
  customId: {
    type: String,
    // unique: true,
  },
});

export default warehouseSchema;
