import express from 'express';
import userRouter from './routes/userRoutes';
import { errorHandler } from './controllers/errorController';
import AppError from './utils/AppError';
import cookieParser from 'cookie-parser';
import accountRouter from './routes/accountRoutes';
import counterRouter from './routes/counterRoutes';
import cryptoRouter from './routes/cryptoRoutes';
import giftcardRouter from './routes/giftcardRoutes';
import warehouseRouter from './routes/warehouseRoutes';
import itemRouter from './routes/itemRoutes';
import billRouter from './routes/billRoutes';
import cors from 'cors';
import commissionRouter from './routes/commissionRoutes';
import manageRouter from './routes/manageRoutes';
import transactionRouter from './routes/transactionRoutes';

const app = express();

const allowList = [
  'http://localhost:3000',
  'http://localhost:5500',
  'https://talaria-web.vercel.app',
  'talaria-web.vercel.app',
  'https://talaria-web-5t4hmkiac-binhthaitrinh.vercel.app',
  'talaria-web-5t4hmkiac-binhthaitrinh.vercel.app',
  'https://talaria-order.xyz',
];

const corsOption = function (req: any, callback: any) {
  let corsOption;
  if (allowList.indexOf(req.header('Origin')) !== -1) {
    corsOption = {
      origin: true,
      // process.env.NODE_ENV === 'production'
      // ? 'https://talaria-web.vercel.app'
      // : 'https://talaria-web.vercel.app',
      credentials: true,
    };
  } else {
    corsOption = { origin: false, credentials: true };
  }
  callback(null, corsOption);
};

app.use(cors(corsOption));
app.set('trust proxy', 1);

app.use(express.json());

// need this to read cookies from request
app.use(cookieParser());

app.get('/', async (_req, res, _next) => {
  res.send('Hello');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/counters', counterRouter);
app.use('/api/v1/cryptos', cryptoRouter);
app.use('/api/v1/giftcards', giftcardRouter);
app.use('/api/v1/warehouses', warehouseRouter);
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/bills', billRouter);
app.use('/api/v1/commissions', commissionRouter);
app.use('/api/v1/manage', manageRouter);
app.use('/api/v1/transactions', transactionRouter);

app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;
