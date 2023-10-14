import express from 'express';
import * as controller from './controller';

const deviceRouter = express.Router();

deviceRouter.get('/server', controller.retrieveServers);
deviceRouter.get('/routerAll/:username', controller.retrieveAllRouters);
deviceRouter.get('/switchAll/:username', controller.retrieveAllSwitches);
deviceRouter.get('/hostAll/:username', controller.retrieveAllHosts);
deviceRouter.get('/router/:projectId', controller.retrieveRouters);
deviceRouter.get('/switch/:projectId', controller.retrieveSwitches);
deviceRouter.get('/host/:projectId', controller.retrieveHosts);
deviceRouter.get('/:projectId', controller.retrieveProjectDevices);
deviceRouter.post('/server', controller.createServer);
deviceRouter.post('/router', controller.createRouter);
deviceRouter.post('/switch', controller.createSwitch);
deviceRouter.post('/host', controller.createHost);
deviceRouter.delete('/server/:serverId', controller.deleteServer);
deviceRouter.delete('/router/:routerId', controller.deleteRouter);
deviceRouter.delete('/switch/:switchId', controller.deleteSwitch);
deviceRouter.delete('/host/:hostId', controller.deleteHost);

export default deviceRouter;
