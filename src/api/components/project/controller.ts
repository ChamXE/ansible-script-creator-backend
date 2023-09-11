import type e from 'express';
import logger from 'logger';
import * as project from '@/services/postgres/project';
import { success, failure } from '@/api/util';

const log = logger('API', 'PROJECT');

export async function retrieveProjects(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveProjects(request.params.username);
        success(response, { project: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}