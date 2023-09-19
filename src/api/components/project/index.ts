import express from 'express';
import * as controller from './controller';

const projectRouter = express.Router();

projectRouter.get('/:username', controller.retrieveProjects);
projectRouter.get('/routerSwitch/:projectId', controller.retrieveRouterSwitch);
projectRouter.get('/switchSwitch/:projectId', controller.retrieveSwitchSwitch);
projectRouter.get('/switchHost/:projectId', controller.retrieveSwitchHost);
projectRouter.post('/', controller.createProject)
projectRouter.post('/routerSwitch', controller.createRouterSwitch);
projectRouter.post('/switchSwitch', controller.createSwitchSwitch);
projectRouter.post('/switchHost', controller.createSwitchHost);
projectRouter.put('/routerSwitch', controller.updateRouterSwitch);
projectRouter.put('/switchSwitch', controller.updateSwitchSwitch);
projectRouter.put('/switchHost', controller.updateSwitchHost);
projectRouter.delete('/:projectId', controller.deleteProject);
projectRouter.delete('/routerSwitch/:projectId/:routerId/:switchId', controller.deleteRouterSwitch);
projectRouter.delete('/switchSwitch/:projectId/:switchId_src/:switchId_dst', controller.deleteSwitchSwitch);
projectRouter.delete('/switchHost/:projectId/:switchId/:hostId', controller.deleteSwitchHost);

export default projectRouter;
