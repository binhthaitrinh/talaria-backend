import { Types } from 'mongoose';
export const decToNum = (dec: Types.Decimal128) =>
  dec ? parseFloat(dec.toString()) : dec;

export const decToStr = (dec: Types.Decimal128 | number, unit: string) => {
  if (dec) {
    if (unit === 'date') {
      return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
      } as any).format(new Date(dec.toString()));
    } else if (unit === 'usd' || unit === 'vnd') {
      return new Intl.NumberFormat('us-US', {
        style: 'currency',
        currency: unit,
      }).format(parseFloat(dec.toString()));
    } else if (unit === 'btc') {
      return `${dec.toString()} btc`;
    } else if (unit === 'percent') {
      return parseFloat(dec.toString()).toLocaleString('en-GB', {
        style: 'percent',
        maximumSignificantDigits: 4,
      });
    } else if (unit === 'kg' || unit === 'lbs') {
      return `${parseFloat(dec.toString()).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${unit}`;
    }
  }

  return undefined;
};
