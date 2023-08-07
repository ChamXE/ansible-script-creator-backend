import type { Config } from '~/api';
import type { Health } from '~/providers/health';

import axios from 'axios';
import config from 'config';

const provider = axios.create({
    baseURL: process.env.HEALTH_ENDPOINT ?? `http://localhost:${config.get<Config>('api').port}`,
    timeout: 3000,
});
provider.interceptors.response.use(undefined, (e) => {
    throw Error(e.message);
});

export async function health(): Promise<Health> {
    return (await provider.get(`/health`)).data;
}
