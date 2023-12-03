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