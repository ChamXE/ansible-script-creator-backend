import express from 'express';

import * as middleware from './middleware';
import userRouter from './components/user';

const router = express.Router();

router.use(middleware.logRequest);
router.use('/user', userRouter);

export default router;
