import type { Config } from '~/postgres';

import config from 'config';
import pg, { QueryConfig } from 'pg';
import logger, { LogLevel } from 'logger';

// Type setters
pg.types.setTypeParser(pg.types.builtins.INT8, parseInt);
pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);

const log = logger('POSTGRES');
log.setSettings({ minLevel: (process.env.POSTGRES_LOG_LEVEL as LogLevel) || 'info' });

const subscribers: Record<string, ((data: any) => any)[]> = {};
const client = new pg.Client(config.get<Config>('postgres'));

client.on('notification', ({ channel, payload }) => {
    try {
        const data = JSON.parse(payload!);
        log.debug('Incoming notification', { channel, data });
        subscribers[channel].forEach((callback) => callback(data));
    } catch (e) {
        log.error(e);
    }
});

export async function init(): Promise<void> {
    return client.connect();
}

export async function query<T>(query: string | QueryConfig, values?: any[]): Promise<T[]> {
    try {
        return (await client.query(query, values)).rows ?? [];
    } catch (e) {
        log.error(query, values);
        throw e;
    }
}

export async function listen<T>(channel: string, callback: (data: T) => any): Promise<void> {
    try {
        if (!subscribers[channel]) {
            subscribers[channel] = [];
            await client.query(`listen ${channel}`);
        }
        subscribers[channel].push(callback);
    } catch (e) {
        log.error(e);
        throw e;
    }
}
