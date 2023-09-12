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
    management: string;
    configuration: RouterConfiguration;
}

export interface Switch {
    switchid: number;
    switchname: string;
    projectid: number;
    stp: boolean;
    controller: string;
}

export interface Host {
    hostid: number;
    hostname: string;
    projectid: number;
    ip: string | null;
    subnet: string | null;
}

export interface RouterConfiguration {
    users: RouterUser[]
    routes: Route[]
}

export interface IP {
    ip: string;
    mask: string | number;
    description?: string;
    portName?: string;
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
    secret: number;
}

export interface ProjectDevice {
    router: Router[];
    switch: Switch[];
    host: Host[]
}