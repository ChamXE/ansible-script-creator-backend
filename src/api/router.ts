import express from 'express';

import * as middleware from './middleware';
import userRouter from './components/user';
import deviceRouter from './components/device';
import projectRouter from './components/project';

const router = express.Router();

router.use('/user', userRouter);
router.use(middleware.authorizeRequest);
router.use(middleware.logRequest);
router.use('/device', deviceRouter);
router.use('/project', projectRouter);

export default router;
