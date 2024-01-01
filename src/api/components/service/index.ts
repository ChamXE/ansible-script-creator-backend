import express from 'express';
import * as controller from './controller';

const serviceRouter = express.Router();

serviceRouter.get('/bgp/:routerId', controller.retrieveRouterBGPInfo);
serviceRouter.get('/customIntent/:projectId', controller.retrieveCustomIntent);
serviceRouter.get('/customIntent/connection/:projectId', controller.retrieveConnections);
serviceRouter.get('/customIntent/sources/:projectId', controller.retrieveSources);
serviceRouter.post('/bgp', controller.createBGPConfiguration);
serviceRouter.post('/customIntent', controller.upsertCustomIntent);
serviceRouter.delete('/bgp/:configId', controller.deleteBGPConfiguration);
serviceRouter.delete('/customIntent/:configId', controller.deleteCustomIntent);

export default serviceRouter;
