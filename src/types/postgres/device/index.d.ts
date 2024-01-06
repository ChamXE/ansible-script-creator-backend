export interface Server {
    serverid: number;
    servername: string;
    ip: string;
    rootcredential: User;
}

export interface Router {
    routerid: number;
    routername: string;
    projectid: number;
    management: string | null;
    configuration: RouterConfiguration;
}

export interface Switch {
    switchid: number;
    switchname: string;
    projectid: number;
    controller: boolean;
}

export interface Host {
    hostid: number;
    hostname: string;
    projectid: number;
    ip: string | null;
    subnet: string | null;
    defaultgateway: number;
}

export interface RouterConfiguration {
    users: RouterUser[]
    routes: Route[]
}

export interface User {
    username: string;
    password: string;
}

export interface Route {
    prefix: string;
    mask: string;
    exitInterface?: string;
    exitGateway?: string;
    metric?: number;
}

export interface RouterUser extends User {
    privilege: number;
}

export interface ProjectDevice {
    router: Router[];
    switch: Switch[];
    host: Host[]
}