import * as postgres from '@/services/postgres';
import { Server, Router, Switch, Host } from '~/postgres/device';

export async function retrieveServers(): Promise<Server[]> {
    const query = `
        SELECT
            s.serverid,
            s.servername,
            s.ip,
            s.rootcredential,
            COUNT(p.serverid) as count
        FROM server s
        LEFT JOIN project p
        ON p.serverid = s.serverid
        GROUP BY s.serverid
        ORDER BY count, s.serverid;
    `;

    return (await postgres.query<Server>(query));
}

export async function retrieveRouters(username: string): Promise<Router[]> {
    const query = `
        SELECT
            r.routerid,
            r.routername,
            r.projectid,
            r.management,
            r.configuration
        FROM (
            SELECT
                projectid
            FROM project
            WHERE username = $1
            ) q1
        INNER JOIN router r
        ON r.projectid = q1.projectid;
    `;
    return (await postgres.query<Router>(query, [username]));
}

export async function retrieveSwitches(username: string): Promise<Switch[]> {
    const query = `
        SELECT
            s.switchid,
            s.switchname,
            s.projectid,
            s.stp,
            s.controller
        FROM (
            SELECT
                projectid
            FROM project
            WHERE username = $1
            ) q1
        INNER JOIN switch s
        ON s.projectid = q1.projectid;
    `;
    return (await postgres.query<Switch>(query, [username]));
}

export async function retrieveHosts(username: string): Promise<Host[]> {
    const query = `
        SELECT
            h.hostid,
            h.hostname,
            h.projectid,
            h.ip,
            h.subnet
        FROM (
            SELECT
                projectid
            FROM project
            WHERE username = $1
            ) q1
        INNER JOIN host h
        ON h.projectid = q1.projectid;
    `;
    return (await postgres.query<Host>(query, [username]));
}

export async function createServer({ serverid, servername, ip, rootcredential }: Server): Promise<void> {
    const query = `
        INSERT INTO server(serverid, servername, ip, rootcredential)
        VALUES (${serverid ? serverid : 'nextval(\'server_serverid_seq\')'}, $1, $2, $3)
        ON CONFLICT ON CONSTRAINT server_pk
        DO 
            UPDATE
            SET
                serverid = EXCLUDED.serverid,
                servername = EXCLUDED.servername,
                ip = EXCLUDED.ip,
                rootcredential = EXCLUDED.rootcredential;
    `;

    await postgres.query(query, [servername, ip, rootcredential]);
}

export async function createRouter({ projectid, routerid, routername, management, configuration }: Router): Promise<void> {
    const query = `
        INSERT INTO router(projectid, routerid, routername, management, configuration)
        VALUES ($1, ${routerid ? routerid : 'nextval(\'router_routerid_seq\')'}, $2, $3, $4)
        ON CONFLICT ON CONSTRAINT router_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                routerid = EXCLUDED.routerid,
                routername = EXCLUDED.routername,
                management = EXCLUDED.management,
                configuration = EXCLUDED.configuration;
    `;

    await postgres.query(query, [projectid, routername, management, configuration]);
}

export async function createSwitch({ projectid, switchid, switchname, stp, controller }: Switch): Promise<void> {
    const query = `
        INSERT INTO switch(projectid, switchid, switchname, stp, controller)
        VALUES ($1, ${switchid ? switchid : 'nextval(\'switch_switchid_seq\')'}, $2, $3, $4)
        ON CONFLICT ON CONSTRAINT switch_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                switchid = EXCLUDED.switchid,
                switchname = EXCLUDED.switchname,
                stp = EXCLUDED.stp,
                controller = EXCLUDED.controller;
    `;

    await postgres.query(query, [projectid, switchname, stp, controller]);
}

export async function createHost({ projectid, hostid, hostname, ip, subnet }: Host): Promise<void> {
    const query = `
        INSERT INTO host(projectid, hostid, hostname, ip, subnet)
        VALUES ($1, ${hostid ? hostid : 'nextval(\'host_hostid_seq\')'}, $2, $3, $4)
        ON CONFLICT ON CONSTRAINT host_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                hostid = EXCLUDED.hostid,
                hostname = EXCLUDED.hostname,
                ip = EXCLUDED.ip,
                subnet = EXCLUDED.subnet;
    `;

    await postgres.query(query, [projectid, hostname, ip, subnet]);
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