import type e from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import session from 'express-session';

export type Config = {
    port: number;
    secret: string;
};

export type ResponseBody = Record<string, any> | undefined;

export interface Request<
    Params extends ParamsDictionary | undefined = undefined,
    ResBody extends ResponseBody = undefined,
    ReqBody extends Json | undefined = undefined,
    ReqQuery = Query
> extends e.Request<Params, ResBody, ReqBody, ReqQuery> {}

export interface Response<ResBody extends ResponseBody = undefined> extends e.Response<ResBody> {}

declare module 'express-session' {
    export interface SessionData {
        username: string;
    }
}