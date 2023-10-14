import type e from 'express';
import logger from 'logger';
import bcrypt from 'bcrypt';
import * as user from '@/services/postgres/user';
import { success, failure } from '@/api/util';
import {sessionStore} from "@/api";

const log = logger('API', 'USER');

export async function validateUser(request: e.Request, response: e.Response): Promise<void> {
    try {
        const { username, password } = request.body;
        const passwordHash = await user.getPassword(username);
        if(passwordHash) {
            if(await bcrypt.compare(password, passwordHash)) {
                request.session.username = username;
                return success(response, { "username": username });
            }
        }
        return success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function registerUser(request: e.Request, response: e.Response): Promise<void> {
    try {
        const { password } = request.body;
        const hashPassword = await bcrypt.hash(password, 10);
        await user.registerUser({
            ...request.body,
            password: hashPassword
        });
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function checkUsernameAvailability(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await user.checkUsernameAvailability(request.params.username);
        success(response, { availability: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function getUser(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await user.getUser(request.params.username);
        success(response, { ...result })
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function changePassword(request: e.Request, response: e.Response): Promise<void> {
    try {
        const passwordHash = await user.getPassword(request.body.username);
        if (!passwordHash) {
            success(response, { success: false });
            return;
        }
        if (await bcrypt.compare(request.body.password, passwordHash)) {
            await user.changePassword({
                ...request.body,
                newPassword: await bcrypt.hash(request.body.newPassword, 10)
            });
            success(response, { success: true });
            return;
        }
        success(response, { success: false });
        return;
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function logoutUser(request: e.Request, response: e.Response): Promise<void> {
    try {
        request.session.destroy((err) => {
            response.clearCookie("connect.sid").send('clear cookie');
            if(err) log.error(err);
        });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}