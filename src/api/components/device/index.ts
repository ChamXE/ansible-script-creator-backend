import express from 'express';
import * as controller from './controller';

const deviceRouter = express.Router();

deviceRouter.get('/server', controller.retrieveServers);
deviceRouter.get('/router/:username', controller.retrieveRouters);
deviceRouter.get('/switch/:username', controller.retrieveSwitches);
deviceRouter.get('/host/:username', controller.retrieveHosts);
deviceRouter.post('/server', controller.createServer);
deviceRouter.post('/router', controller.createRouter);
deviceRouter.post('/switch', controller.createSwitch);
deviceRouter.post('/host', controller.createHost);
deviceRouter.delete('/server/:serverId', controller.deleteServer);
deviceRouter.delete('/router/:routerId', controller.deleteRouter);
deviceRouter.delete('/switch/:switchId', controller.deleteSwitch);
deviceRouter.delete('/host/:hostId', controller.deleteHost);

export default deviceRouter;
