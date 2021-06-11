import express from 'express';
import { getStats } from '../controllers/manageControllers';

const manageRouter = express.Router();

manageRouter.get('/', getStats);

export default manageRouter;
