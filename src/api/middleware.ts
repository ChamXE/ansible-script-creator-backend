import type { Request, Response, NextFunction } from 'express';

import dayjs from 'dayjs';
import logger from 'logger';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as user from '@/services/postgres/user';

const log = logger('API', 'AUTH');
log.setSettings({ minLevel: process.env.LOG_REQUEST === 'true' ? 'debug' : 'info' });

const PATH = './logs/api';
if (!existsSync(PATH)) mkdirSync(PATH, { recursive: true });

export async function authorizeRequest(request: Request, response: Response, next: NextFunction): Promise<void> {
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
