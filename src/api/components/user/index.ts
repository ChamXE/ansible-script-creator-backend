import express from 'express';
import * as controller from './controller';

const userRouter = express.Router();

userRouter.post('/login', controller.validateUser);
userRouter.post('/registerUser', controller.registerUser);
userRouter.post('/changePassword', controller.changePassword);
userRouter.get('/:username', controller.getUser);
userRouter.get('/checkUsernameAvailability/:username', controller.checkUsernameAvailability);
userRouter.post('/logout', controller.logoutUser);

export default userRouter;
