import { IBillDocument } from './bills.types';

export async function calcBill(this: IBillDocument) {
  console.log(this);
  return this;
}
