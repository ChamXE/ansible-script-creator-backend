import * as postgres from '@/services/postgres';
import { Server, Router, Switch, Host } from '~/postgres/device';

export async function retrieveServers(username: string): Promise<Server[]> {
    const query = `
        SELECT * FROM server WHERE username = $1;
    `;

    return (await postgres.query<Server>(query, [username]));
}

export async function retrieveRouters(username: string): Promise<Router[]> {
    const query = `
        SELECT
            r.routerid,
            r.routername,
            r.serverid,
            r.nic
        FROM (
            SELECT
                serverid
            FROM server
            WHERE username = $1
            ) q1
        INNER JOIN router r
        ON r.serverid = q1.serverid;
    `;
    return (await postgres.query<Router>(query, [username]));
}

export async function retrieveSwitches(username: string): Promise<Switch[]> {
    const query = `
        SELECT
            s.switchid,
            s.switchname,
            s.serverid
        FROM (
            SELECT
                serverid
            FROM server
            WHERE username = $1
            ) q1
        INNER JOIN switch s
        ON s.serverid = q1.serverid;
    `;
    return (await postgres.query<Switch>(query, [username]));
}

export async function retrieveHosts(username: string): Promise<Host[]> {
    const query = `
        SELECT
            h.hostid,
            h.hostname,
            h.serverid
        FROM (
            SELECT
                serverid
            FROM server
            WHERE username = $1
            ) q1
        INNER JOIN host h
        ON h.serverid = q1.serverid;
    `;
    return (await postgres.query<Host>(query, [username]));
}

export async function createServer({ serverid, username, servername }: Server): Promise<void> {
    const query = `
        INSERT INTO server(serverid, username, servername)
        VALUES (${serverid ? serverid : 'nextval(\'server_serverid_seq\')'}, $1, $2)
        ON CONFLICT ON CONSTRAINT server_pk
        DO 
            UPDATE
            SET
                serverid = EXCLUDED.serverid,
                username = EXCLUDED.username,
                servername = EXCLUDED.servername;
    `;

    await postgres.query(query, [username, servername]);
}

export async function createRouter({ serverid, routerid, routername, nic }: Router): Promise<void> {
    const query = `
        INSERT INTO router(serverid, routerid, routername, nic)
        VALUES ($1, ${routerid ? routerid : 'nextval(\'router_routerid_seq\')'}, $2, $3)
        ON CONFLICT ON CONSTRAINT router_pk
        DO 
            UPDATE
            SET
                serverid = EXCLUDED.serverid,
                routerid = EXCLUDED.routerid,
                routername = EXCLUDED.routername,
                nic = EXCLUDED.nic;
    `;

    await postgres.query(query, [serverid, routername, nic]);
}

export async function createSwitch({ serverid, switchid, switchname }: Switch): Promise<void> {
    const query = `
        INSERT INTO switch(serverid, switchid, switchname)
        VALUES ($1, ${switchid ? switchid : 'nextval(\'switch_switchid_seq\')'}, $2)
        ON CONFLICT ON CONSTRAINT switch_pk
        DO 
            UPDATE
            SET
                serverid = EXCLUDED.serverid,
                switchid = EXCLUDED.switchid,
                switchname = EXCLUDED.switchname;
    `;

    await postgres.query(query, [serverid, switchname]);
}

export async function createHost({ serverid, hostid, hostname }: Host): Promise<void> {
    const query = `
        INSERT INTO host(serverid, hostid, hostname)
        VALUES ($1, ${hostid ? hostid : 'nextval(\'host_hostid_seq\')'}, $2)
        ON CONFLICT ON CONSTRAINT host_pk
        DO 
            UPDATE
            SET
                serverid = EXCLUDED.serverid,
                hostid = EXCLUDED.hostid,
                hostname = EXCLUDED.hostname;
    `;

    await postgres.query(query, [serverid, hostname]);
}

export async function deleteServer(serverId: string): Promise<void> {
    const query = `
        DELETE FROM server WHERE serverid = $1;
    `;

    await postgres.query(query, [serverId]);
}

export async function deleteRouter(routerId: string): Promise<void> {
    const query = `
        DELETE FROM router WHERE routerid = $1;
    `;

    await postgres.query(query, [routerId]);
}

export async function deleteSwitch(switchId: string): Promise<void> {
    const query = `
        DELETE FROM switch WHERE switchid = $1;
    `;

    await postgres.query(query, [switchId]);
}

export async function deleteHost(hostId: string): Promise<void> {
    const query = `
        DELETE FROM host WHERE hostid = $1;
    `;

    await postgres.query(query, [hostId]);
}