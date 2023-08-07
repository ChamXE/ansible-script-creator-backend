import logger from 'logger';

export default async function subscribers(): Promise<void> {
    const log = logger('SUBSCRIBERS');

    log.info('Subscribers loaded');
}
