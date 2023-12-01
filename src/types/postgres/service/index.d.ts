export interface RouterBGPInfo {
    routerid: number;
    routername: string;
    bgp: BGP[]

}

interface BGP {
    asnumber?: number;
    routerid: number;
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