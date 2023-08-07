import type e from 'express';
import logger from 'logger';
import * as user from '@/services/postgres/user';
import { success, failure } from '@/api/util';

const log = logger('API', 'USER');

export async function validateUser(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await user.validateUser(request.body);
        success(response, { ...result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function registerUser(request: e.Request, response: e.Response): Promise<void> {
    try {
        await user.registerUser(request.body);
        success(response);
    } catch(e) {
        log.error(e);
        failure(response, e);
    }
}

export async function checkUsernameAvailability(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await user.checkUsernameAvailability(request.params.username);
        success(response, { availability: result });
    } catch(e) {
        log.error(e);
        failure(response, e);
    }
}

export async function getUser(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await user.getUser(request.params.username);
        success(response, { ...result })
    } catch(e) {
        log.error(e);
        failure(response, e);
    }
}

export async function changePassword(request: e.Request, response: e.Response): Promise<void> {
    try {
        const password = await user.getPassword(request.body.username);
        if(!password) {
            success(response, { success: false });
            return;
        }
        if(password === request.body.password) {
            await user.changePassword(request.body);
            success(response, { success: true });
            return;
        }
        success(response, { success: false });
        return;
    } catch(e) {
        log.error(e);
        failure(response, e);
    }
}