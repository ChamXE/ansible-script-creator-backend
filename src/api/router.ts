import express from 'express';

import * as middleware from './middleware';
import userRouter from './components/user';
import deviceRouter from './components/device';

const router = express.Router();

router.use(middleware.logRequest);
router.use('/user', userRouter);
router.use('/device', deviceRouter);

export default router;
