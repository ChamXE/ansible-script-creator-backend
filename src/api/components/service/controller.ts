import e from "express";
import * as service from "@/services/postgres/service";
import logger from 'logger';
import { failure, success } from "@/api/util";
import { BGP } from "~/postgres/service";

const log = logger('API', 'SERVICE');

export async function retrieveRouterBGPInfo(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await service.retrieveBGPInfo(+request.params.routerId);
        success(response, result);
    } catch(e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createBGPConfiguration(request: e.Request, response: e.Response): Promise<void> {
    try {
        const bgp: BGP = request.body;
        await service.createBGPConfiguration(bgp);
        success(response);
    } catch(e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteBGPConfiguration(request: e.Request, response: e.Response): Promise<void> {
    try {
        await service.deleteBGPConfiguration(+request.params.configId);
        success(response);
    } catch(e) {
        log.error(e);
        failure(response, e);
    }
}