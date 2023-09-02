export type Server = {
    serverid: number;
    username: string;
    servername: string;
}

export type Router = {
    routerid: number;
    routername: string;
    serverid: number;
    nic: string[];
}

export type Switch = {
    switchid: number;
    switchname: string;
    serverid: number;
}

export type Host = {
    hostid: number;
    hostname: string;
    serverid: number;
}