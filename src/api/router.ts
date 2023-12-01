import express from 'express';

import * as middleware from './middleware';
import userRouter from '@/api/components/user';
import deviceRouter from '@/api/components/device';
import projectRouter from '@/api/components/project';
import serviceRouter from "@/api/components/service";

const router = express.Router();

router.use(middleware.authorizeRequest);
router.use(middleware.logRequest);
router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/project', projectRouter);
router.use('/service', serviceRouter);

export default router;
