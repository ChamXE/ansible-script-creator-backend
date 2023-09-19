import type e from 'express';
import logger from 'logger';
import * as project from '@/services/postgres/project';
import { success, failure } from '@/api/util';
import { Project, RouterSwitch, SwitchHost, SwitchSwitch } from '@/types/postgres/project';

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

export async function createProject(request: e.Request, response: e.Response): Promise<void> {
    try {
        const p: Project = request.body;
        await project.createProject(p);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteProject(request: e.Request, response: e.Response): Promise<void> {
    try {
        await project.deleteProject(+request.params.projectId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveRouterSwitch(+request.params.projectId);
        success(response, { connection: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveSwitchSwitch(+request.params.projectId);
        success(response, { connection: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveSwitchHost(+request.params.projectId);
        success(response, { connection: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const routerSwitch: RouterSwitch = request.body;
        await project.createRouterSwitch(routerSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const switchSwitch: SwitchSwitch = request.body;
        await project.createSwitchSwitch(switchSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const switchHost: SwitchHost = request.body;
        await project.createSwitchHost(switchHost);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const {
            projectId,
            routerId,
            switchId
        } = request.params;
        await project.deleteRouterSwitch(+projectId, +routerId, +switchId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const {
            projectId,
            switchId_src,
            switchId_dst
        } = request.params;
        await project.deleteSwitchSwitch(+projectId, +switchId_src, +switchId_dst);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const {
            projectId,
            switchId,
            hostId
        } = request.params;
        await project.deleteSwitchHost(+projectId, +switchId, +hostId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function updateRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const oldRouterSwitch: RouterSwitch = request.body.oldConnectionInfo;
        const newRouterSwitch: RouterSwitch = request.body.newConnectionInfo;
        await project.updateRouterSwitch(oldRouterSwitch, newRouterSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function updateSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const oldSwitchSwitch: SwitchSwitch = request.body.oldConnectionInfo;
        const newSwitchSwitch: SwitchSwitch = request.body.newConnectionInfo;
        await project.updateSwitchSwitch(oldSwitchSwitch, newSwitchSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function updateSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const oldSwitchHost: SwitchHost = request.body.oldConnectionInfo;
        const newSwitchHost: SwitchHost = request.body.newConnectionInfo;
        await project.updateSwitchHost(oldSwitchHost, newSwitchHost);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}