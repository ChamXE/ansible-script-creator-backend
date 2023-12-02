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
    portname: string;
    peer: string;
    source: string;
}

export interface BGPConfig {
    routername: string;
    bgp: BGP[];
}