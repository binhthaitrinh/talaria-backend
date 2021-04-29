import express from 'express';
import {
  forgotPassword,
  protect,
  resetPassword,
  signin,
  signout,
  signup,
} from '../controllers/authController';
import {
  deleteUser,
  getMe,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.patch('/reset-password/:resetToken', resetPassword);
userRouter.get('/signout', signout);
userRouter.get('/', getUsers);
userRouter.route('/:id').patch(updateUser).delete(deleteUser);
userRouter.use(protect);
userRouter.get('/me', protect, getMe, getUser);

export default userRouter;
