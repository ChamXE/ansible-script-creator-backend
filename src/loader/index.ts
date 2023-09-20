import logger from 'logger';

export default async function loader(): Promise<void> {
    const log = logger('LOADER');

    log.info('Loading Postgresql');
    await (await import('@/services/postgres')).init();
    log.info('Postgresql loaded');

    log.info('Loading servers');
    await import('@/services/execution');
    log.info('Servers loaded');

    // log.info('Loading jobs');
    // await (await import('@/jobs')).default();
    // log.info('Jobs loaded');

    // log.info('Loading subscribers');
    // await (await import('@/subscribers')).default();
    // log.info('Subscribers loaded');

    log.info('Loading API');
    await import('@/api');
    log.info('API Loaded');
}
