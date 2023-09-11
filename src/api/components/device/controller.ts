import type e from 'express';
import logger from 'logger';
import * as device from '@/services/postgres/device';
import { success, failure } from '@/api/util';
import { Server, Router, Switch, Host } from '~/postgres/device';

const log = logger('API', 'DEVICE');

export async function retrieveServers(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await device.retrieveServers();
        success(response, { server: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveRouters(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await device.retrieveRouters(request.params.username);
        success(response, { router: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveSwitches(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await device.retrieveSwitches(request.params.username);
        success(response, { switch: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveHosts(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await device.retrieveHosts(request.params.username);
        success(response, { host: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createServer(request: e.Request, response: e.Response): Promise<void> {
    try {
        const server: Server = request.body;
        await device.createServer(server);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createRouter(request: e.Request, response: e.Response): Promise<void> {
    try {
        const router: Router = request.body;
        await device.createRouter(router);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const switchR: Switch = request.body;
        await device.createSwitch(switchR);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const host: Host = request.body;
        await device.createHost(host);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteServer(request: e.Request, response: e.Response): Promise<void> {
    try {
        await device.deleteServer(request.params.serverId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteRouter(request: e.Request, response: e.Response): Promise<void> {
    try {
        await device.deleteRouter(request.params.routerId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        await device.deleteSwitch(request.params.switchId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        await device.deleteHost(request.params.hostId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}