import {InterfaceConfiguration} from "~/postgres/project";

export interface BGP {
    asnumber?: number;
    routerid?: number;
    configid?: number;
    bgprouterid?: string;
    neighbour?: Neighbour[];
    network?: AdvertiseNetwork[];
}

interface Neighbour {
    id: string;
    remoteas: number;
    ebgpmultihop: boolean;
}

interface AdvertiseNetwork {
    ip: string;
    mask: string;
}

export interface ONOSConfig {
    routername: string;
    switchname: string;
    portname: string;
    interfacename: string;
    peer: string | null;
    source: string | null;
    subnet: string | null;
}

export interface BGPConfig {
    routername: string;
    bgp: BGP[];
}

export interface RawConnection {
    source: string;
    destination: string;
    portname: string;
}

export type ParsedConnection = {
    source: Connection;
    destination: Connection;
}

type Connection = {
    [source: string]: Destination;
}

export type Destination = {
    [destination: string]: string;
}

export interface Source {
    routerid: number;
    routername: string;
    configuration: InterfaceConfiguration;
}

export interface CustomIntent {
    configid: number | null;
    projectid: number;
    routerid: number;
    source: string;
    sourcekey: string;
    intermediate: string[];
    destination: string;
    destkey: string;
    protocol: string | null;
    ethertype: string;
}