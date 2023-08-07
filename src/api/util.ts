import type { Response, ResponseBody } from '~/api';

export function success<ResBody extends ResponseBody>(
    response: Response<ResBody>,
    data?: ResBody,
    message: Json = 'ok',
    code = 200
): void {
    response.status(code).send({
        result: true,
        message,
        data,
    } as unknown as ResBody);
}

export function failure<ResBody extends ResponseBody>(
    response: Response<ResBody>,
    message: Json = 'WIP',
    code = 400
): void {
    response.status(code).send({
        result: false,
        message,
    } as unknown as ResBody);
}
