import type { Config } from '~/redis';

import config from 'config';
import RedisService from './service';
import logger, { LogLevel } from 'logger';

const { namespace, ...options } = config.get<Config>('redis');

const minLevel = (process.env.REDIS_LOG_LEVEL as LogLevel) || 'info';

const log = logger('REDIS');
log.setSettings({ minLevel });

const redis = new RedisService(options, namespace, minLevel);

export default redis;
