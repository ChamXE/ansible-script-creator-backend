import type { LogLevel } from 'logger';
import type { Config, Payload } from '~/influx';

import config from 'config';
import InfluxService from './service';
import {
    ParameterizedQuery,
    WritePrecisionType,
    fluxInteger,
    fluxFloat,
    fluxString,
    fluxDateTime,
    toFluxValue,
} from '@influxdata/influxdb-client';

const { url, token, org, bucket, writeOptions } = config.get<Config>('influx');
const service = new InfluxService(
    url,
    token,
    org,
    bucket,
    writeOptions,
    (process.env.LIB_INFLUX_LOG_LEVEL as LogLevel) ?? 'info'
);

export { bucket };

export function int(value: number): string {
    return fluxInteger(value).toString();
}

export function float(value: number): string {
    return fluxFloat(Number.isInteger(value) ? value.toFixed(1) : value).toString();
}

export function string(value: string): string {
    return fluxString(value).toString();
}

export function array(value: any[]): string {
    return toFluxValue(value);
}

export function datetime(value: number, unit: WritePrecisionType = 's'): string {
    switch (unit) {
        case 's':
            value *= 1000;
            break;
        case 'ms':
            break;
        case 'us':
            value /= 1000;
            break;
        case 'ns':
            value /= 1000_000;
            break;
        default:
            throw Error(`Unknown precision of type ${unit}`);
    }
    return fluxDateTime(new Date(value).toISOString()).toString();
}

export function write<T extends Payload>(payload: T | T[]): void {
    return service.write(payload);
}

export async function flush(): Promise<void> {
    return service.flush();
}

export async function query<T>(query: string | ParameterizedQuery): Promise<T[]> {
    return service.query(query);
}
