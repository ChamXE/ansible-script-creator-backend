import logger from 'logger';

export default async function index(): Promise<void> {
    const log = logger('JOBS');

    log.info('Jobs loaded');
}
