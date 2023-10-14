import type { Config } from '~/api';
import type { Config as DBConfig }  from '~/postgres';
import cors from 'cors';
import config from 'config';
import logger from 'logger';
import express from 'express';
import router from './router';
import session from 'express-session';
import genFunc from 'connect-pg-simple';
import listEndpoints from 'express-list-endpoints';

const { port, secret } = config.get<Config>('api');
const {
    host,
    port: dbPort,
    user,
    password,
    database
} = config.get<DBConfig>('postgres');
const cookieExpire = 1000 * 60 * 60;
const PostgresqlStore = genFunc(session);
export const sessionStore = new PostgresqlStore({
    conString: `postgres://${user}:${password}@${host}:${dbPort}/${database}`,
});

const log = logger('LOADER', 'API');

const app = express();

app.set('trust proxy', 1)
app.use(cors({ credentials: true, origin: ["https://fyp-***REMOVED***.me","http://localhost:3000"] }));
app.use(express.json());
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: cookieExpire
    },
    store: sessionStore,
}));

app.use('/', router);
app.listen(port, () => {
    log.info(
        `API Server started @${port}. Listening to routes:`,
        listEndpoints(app)
            .sort(({ path: a }, { path: b }) => (a < b ? -1 : a > b ? 1 : 0))
            .map(({ path, methods }) => `${methods.toString().padEnd(8)}:${path}`)
    );
});

export default app;
