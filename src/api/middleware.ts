import type { Request, Response, NextFunction } from 'express';
import type { Config } from '~/api';

import dayjs from 'dayjs';
import logger from 'logger';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as user from '@/services/postgres/user';
import config from 'config';

const log = logger('API', 'AUTH');
log.setSettings({ minLevel: process.env.LOG_REQUEST === 'true' ? 'debug' : 'info' });

const PATH = './logs/api';
if (!existsSync(PATH)) mkdirSync(PATH, { recursive: true });

const { allowOrigin } = config.get<Config>('api');

export async function authorizeRequest(request: Request, response: Response, next: NextFunction): Promise<void> {
    if(allowOrigin.includes(request.get('origin')!)) return next();
    if(/^\/user\/.*$/.test(request.path)) {
        if(!/^\/user\/changePassword$/.test(request.path) && !/^\/user\/logout$/.test(request.path)) {
            return next();
        }
    }
    const authorize = await user.checkSessionExist(request.sessionID);
    if(authorize) return next();
    const ip = request.header('X-Forwarded-For') || request.ip;
    log.debug(`Unauthorized request attempt ${request.method} ${request.path} from ${ip}`);
    response.status(401).sendStatus(401);
    return;
}

export async function logRequest(request: Request, response: Response, next: NextFunction): Promise<void> {
    const date = dayjs();
    const ip = request.header('X-Forwarded-For') || request.ip;
    log.debug(`Incoming request ${request.method} ${request.path} from ${ip}`);

    createWriteStream(`${PATH}/${date.format('DD-MM-YYYY')}.jsonl`, { flags: 'a' }).write(
        `${JSON.stringify({
            time: date.format('DD/MM/YYYY HH:mm:ss'),
            method: request.method,
            origin: request.get('origin'),
            path: request.path,
            ip,
            params: request.params,
            query: request.query,
            body: request.body,
        })}\n`
    );
    next();
}
