import {Route, RouterUser} from "~/postgres/device";

export interface Project {
    projectid: number | null;
    username: string;
    projectname: string;
    serverid: number;
    generated: boolean;
    ready: boolean;
    count?: number;
}

export interface RouterSwitch {
    projectid: number;
    routerid: number;
    switchid: number;
    portname: string;
    ip: string;
    subnet: string;
    interfacename: string | null;
}

export interface SwitchSwitch {
    projectid: number;
    switchid_src: number;
    switchid_dst: number;
    portname: string;
}

export interface SwitchHost {
    projectid: number;
    switchid: number;
    hostid: number;
    portname: string;
}

export interface RouterInfo {
    routerid: number;
    routername: string;
    ports: Ports;
    users: RouterUser[];
    routes: Route[];

}

export interface SwitchInfo {
    switchname: string;
    controller: string;
    access: string[];
    patch: Patch[];
}

type Patch = {
    patch: string;
    peer: string;
}

type Ports = {
    [portname: string]: {
        ip: string;
        subnet: string;
        name: string;
    }
}

export interface HostInfo {
    hostname: string;
    ip: string;
    subnet: string;
    ovs: string;
    ovsportname: string;
    hostportname: string;
    defaultgateway: string;
}

export type Interfaces = {
    [interfacename: string]: string
}