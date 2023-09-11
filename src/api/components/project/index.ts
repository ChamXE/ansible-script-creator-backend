import express from 'express';
import * as controller from './controller';

const projectRouter = express.Router();

projectRouter.get('/:username', controller.retrieveProjects);

export default projectRouter;
