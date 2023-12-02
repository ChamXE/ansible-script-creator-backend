import express from 'express';
import * as controller from './controller';

const serviceRouter = express.Router();

serviceRouter.get('/bgp/:routerId', controller.retrieveRouterBGPInfo);
serviceRouter.post('/bgp', controller.createBGPConfiguration);
serviceRouter.delete('/bgp/:configId', controller.deleteBGPConfiguration);

export default serviceRouter;
