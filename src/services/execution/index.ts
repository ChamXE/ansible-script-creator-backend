import * as device from "@/services/postgres/device";
import { Server } from "@/services/execution/server/server";
import logger from "logger";

const log = logger('SERVERS');

interface Servers {
    [index: number]: Server
}

async function main(): Promise<Servers> {
    const s = await device.retrieveServers();
    const server: Servers = {};
    s.map((s) => {
        const { username, password } = s.rootcredential;
        const { ip: host } = s;
        server[+s.serverid] = new Server(username, password, host);
    });
    return server;
}

const servers: Servers = await main();
log.info(Object.keys(servers));
export default servers;