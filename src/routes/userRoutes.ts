import express from 'express';
import {
  createUser,
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
  uploadUserPhoto,
  resizeUserPhoto,
  getProfilePic,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.patch('/reset-password/:resetToken', resetPassword);
userRouter.get('/signout', signout);
userRouter.get('/', getUsers);
userRouter.get('/images/:key', getProfilePic);
userRouter.use(protect);
userRouter.get('/me', protect, getMe, getUser);
userRouter.post('/createUser', protect, createUser);
userRouter.patch('/updateImage', uploadUserPhoto, resizeUserPhoto);
userRouter.route('/:id').patch(updateUser).delete(deleteUser).get(getUser);

export default userRouter;
