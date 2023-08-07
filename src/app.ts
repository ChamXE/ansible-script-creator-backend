import dotenv from 'dotenv';
import logger from 'logger';
import loader from '@/loader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.tz.setDefault('Asia/Kuala_Lumpur');

const log = logger('APP');

log.info('Starting');
loader().then(() => log.info('Loaders completed'));

process.on('uncaughtException', (e) => {
    log.setSettings({ exposeStack: true, displayFilePath: 'displayAll' });
    log.fatal('uncaughtException', e);
    process.exit();
});
process.on('unhandledRejection', (e) => {
    log.setSettings({ exposeStack: true, displayFilePath: 'displayAll' });
    log.fatal('unhandledRejection', e);
    process.exit();
});
