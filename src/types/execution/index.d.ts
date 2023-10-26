export interface SSHResponse {
    code: number | null;
    message: string;
}

export type ManagementIP = {
    [routername: string]: {
        routerid?: number;
        management: string;
    };
}