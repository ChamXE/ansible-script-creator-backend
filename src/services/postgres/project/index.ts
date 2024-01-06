import * as postgres from '@/services/postgres';
import { Project, RouterSwitch, SwitchSwitch, SwitchHost, SwitchInfo, RouterInfo, HostInfo, Interfaces } from '~/postgres/project';
import { Server } from "~/postgres/device";
import { ONOSConfig, BGPConfig } from "~/postgres/service";

export async function retrieveProjects(username: string): Promise<Project[]> {
    const query = `
        SELECT * FROM project WHERE username = $1;
    `;

    return (await postgres.query<Project>(query, [username]));
}

export async function createProject({ projectid, projectname, username, serverid, generated, ready }: Project): Promise<void> {
    const query = `
        INSERT INTO project(projectid, projectname, username, serverid, generated, ready)
        VALUES (${projectid ? projectid : 'nextval(\'project_projectid_seq\')'}, $1, $2, $3, $4, $5)
        ON CONFLICT ON CONSTRAINT project_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                projectname = EXCLUDED.projectname,
                username = EXCLUDED.username,
                serverid = EXCLUDED.serverid,
                generated = EXCLUDED.generated,
                ready = EXCLUDED.ready;
    `;

    await postgres.query(query, [projectname, username, serverid, generated, ready]);
}

export async function deleteProject(projectId: number): Promise<void> {
    const query = `
        DELETE FROM project WHERE projectid = $1;
    `;

    await postgres.query(query, [projectId]);
}

export async function retrieveRouterSwitch(projectId: number): Promise<RouterSwitch[]> {
    const query = `
        SELECT * FROM router_switch WHERE projectid = $1;
    `;

    return await postgres.query<RouterSwitch>(query, [projectId]);
}

export async function retrieveSwitchSwitch(projectId: number): Promise<SwitchSwitch[]> {
    const query = `
        SELECT * FROM switch_switch WHERE projectid = $1;
    `;

    return await postgres.query<SwitchSwitch>(query, [projectId]);
}

export async function retrieveSwitchHost(projectId: number): Promise<SwitchHost[]> {
    const query = `
        SELECT * FROM switch_host WHERE projectid = $1;
    `;

    return await postgres.query<SwitchHost>(query, [projectId]);
}

export async function createRouterSwitch({ projectid, routerid, switchid, portname, configuration, peer }: RouterSwitch): Promise<void> {
    const id = await checkInterfaceId(projectid, routerid);
    const interfacename = `GigabitEthernet${id}`;
    const query = `
        INSERT INTO router_switch(projectid, routerid, switchid, portname, configuration, interfacename, peer)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT ON CONSTRAINT router_switch_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                routerid = EXCLUDED.routerid,
                switchid = EXCLUDED.switchid,
                portname = EXCLUDED.portname,
                configuration = EXCLUDED.configuration,
                interfacename = EXCLUDED.interfacename,
                peer = EXCLUDED.peer;
    `;

    await postgres.query(query, [projectid, routerid, switchid, portname, configuration, interfacename, peer]);
}

export async function createSwitchSwitch({ projectid, switchid_src, switchid_dst, portname }: SwitchSwitch): Promise<void> {
    const query = `
        INSERT INTO switch_switch(projectid, switchid_src, switchid_dst, portname )
        VALUES($1, $2, $3, $4)
        ON CONFLICT ON CONSTRAINT switch_switch_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                switchid_src = EXCLUDED.switchid_src,
                switchid_dst = EXCLUDED.switchid_dst,
                portname = EXCLUDED.portname;
    `;

    await postgres.query(query, [projectid, switchid_src, switchid_dst, portname]);
}

export async function createSwitchHost({ projectid, switchid, hostid, portname }: SwitchHost): Promise<void> {
    const query = `
        INSERT INTO switch_host(projectid, switchid, hostid, portname)
        VALUES($1, $2, $3, $4)
        ON CONFLICT ON CONSTRAINT switch_host_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                switchid = EXCLUDED.switchid,
                hostid = EXCLUDED.hostid,
                portname = EXCLUDED.portname;
    `;

    await postgres.query(query, [projectid, switchid, hostid, portname]);
}

export async function deleteRouterSwitch(projectId: number, routerId: number, switchId: number): Promise<void> {
    const query = `
        DELETE FROM router_switch WHERE projectid = $1 AND routerid = $2 AND switchid = $3;
    `;

    await postgres.query(query, [projectId, routerId, switchId]);
}

export async function deleteSwitchSwitch(projectId: number, switchId_src: number, switchId_dst: number): Promise<void> {
    const query = `
        DELETE FROM switch_switch WHERE projectid = $1 AND switchid_src = $2 AND switchid_dst = $3;
    `;

    await postgres.query(query, [projectId, switchId_src, switchId_dst]);
}

export async function deleteSwitchHost(projectId: number, switchId: number, hostId: number): Promise<void> {
    const query = `
        DELETE FROM switch_host WHERE projectid = $1 AND switchid = $2 AND hostid = $3;
    `;

    await postgres.query(query, [projectId, switchId, hostId]);
}

export async function updateRouterSwitch(oldInfo: RouterSwitch, newInfo: RouterSwitch): Promise<void> {
    const { 
        projectid, routerid, switchid,
        portname, configuration, interfacename, peer
    } = newInfo;

    const {
        projectid: oldProjectId, routerid: oldRouterId, switchid: oldSwitchId
    } = oldInfo;

    const query = `
        UPDATE router_switch
        SET
            projectid = $1,
            routerid = $2,
            switchid = $3,
            portname = $4,
            configuration = $5,
            interfacename = $6,
            peer = $7
        WHERE projectid = $8 AND routerid = $9 AND switchid = $10;
    `;

    await postgres.query(query, [
        projectid, routerid, switchid, portname, configuration, interfacename, peer,
        oldProjectId, oldRouterId, oldSwitchId
    ]);
}

export async function updateSwitchSwitch(oldInfo: SwitchSwitch, newInfo: SwitchSwitch): Promise<void> {
    const { projectid, switchid_src, switchid_dst, portname } = newInfo;
    const { projectid: oldProjectId, switchid_src: oldSwitchIdSrc, switchid_dst: oldSwitchIdDst } = oldInfo;

    const query = `
        UPDATE switch_switch
        SET
            projectid = $1,
            switchid_src = $2,
            switchid_dst = $3,
            portname = $4
        WHERE projectid = $5 AND switchid_src = $6 AND switchid_dst = $7;
    `;

    await postgres.query(query, [
        projectid, switchid_src, switchid_dst, portname, 
        oldProjectId, oldSwitchIdSrc, oldSwitchIdDst
    ]);
}

export async function updateSwitchHost(oldInfo: SwitchHost, newInfo: SwitchHost): Promise<void> {
    const { projectid, switchid, hostid, portname } = newInfo;
    const { projectid: oldProjectId, switchid: oldSwitchId, hostid: oldHostId } = oldInfo;

    const query = `
        UPDATE switch_host
        SET
            projectid = $1,
            switchid = $2,
            hostid = $3,
            portname = $4
        WHERE projectid = $5 AND switchid = $6 AND hostid = $7;
    `;

    await postgres.query(query, [
        projectid, switchid, hostid, portname, 
        oldProjectId, oldSwitchId, oldHostId
    ]);
}

export async function retrieveRouterInfo(projectId: number): Promise<RouterInfo[]> {
    const query = `
        SELECT
            q2.routerid,
            q2.routername,
            json_object_agg(q2.portname, q2.ports ORDER BY q2.interfacename) as ports,
            q2.users,
            q2.routes
        FROM
            (SELECT
                q1.routerid,
                q1.routername,
                q1.portname,
                q1.interfacename,
                json_agg(json_build_object('ip', q1.key, 'subnet', q1.configuration ->> key, 'name', q1.interfacename)) as ports,
                q1.users,
                q1.routes
            FROM
                (SELECT
                    r.routerid,
                    r.routername,
                    rs.interfacename,
                    rs.portname,
                    jsonb_object_keys(rs.configuration) as key, rs.configuration,
                    r.configuration -> 'users' as users,
                    r.configuration -> 'routes' as routes
                FROM router r
                LEFT JOIN router_switch rs
                ON r.projectid = rs.projectid AND r.routerid = rs.routerid
                WHERE r.projectid = $1 AND rs.portname IS NOT NULL
                GROUP BY r.routerid, rs.projectid, rs.switchid, rs.configuration, interfacename, portname) q1
            GROUP BY routerid, routername, users, routes, portname, interfacename) q2
        GROUP BY routerid, routername, users, routes;
    `;

    return (await postgres.query<RouterInfo>(query, [projectId]));
}

export async function retrieveSwitchInfo(projectId: number): Promise<SwitchInfo[]> {
    const query = `
        SELECT
            q1.switchname,
            q1.controller,
            q1.patch,
            array_remove(array_agg(DISTINCT rs.portname), null) as access
        FROM (
            SELECT
                s.projectid,
                s.switchname,
                s.switchid,
                s.controller,
                jsonb_strip_nulls(jsonb_agg(jsonb_strip_nulls(jsonb_build_object('patch', ss1.portname, 'peer', ss2.portname)))) as patch
            FROM switch s
            LEFT JOIN switch_switch ss1
            ON s.projectid = ss1.projectid AND ss1.switchid_src = s.switchid
            LEFT JOIN switch_switch ss2
            ON s.projectid = ss2.projectid AND ss2.switchid_dst = s.switchid AND ss2.switchid_src = ss1.switchid_dst
            WHERE s.projectid = $1
            GROUP BY s.switchid, s.switchname
        ) q1
        LEFT JOIN router_switch rs
        ON q1.projectid = rs.projectid AND q1.switchid = rs.switchid
        GROUP BY q1.projectid, q1.switchid, q1.switchname, q1.controller, q1.patch;
    `;

    return (await postgres.query<SwitchInfo>(query, [projectId]));
}

export async function retrieveHostInfo(projectId: number): Promise<HostInfo[]> {
    const query = `
        SELECT
            h.hostname,
            h.ip,
            h.subnet,
            s.switchname as ovs,
            sh.portname as ovsportname,
            concat(h.hostname, '-eth0') as hostportname,
            jsonb_object_keys(rs.configuration) as defaultgateway
        FROM host h
        LEFT JOIN switch_host sh
        ON h.projectid = sh.projectid AND h.hostid = sh.hostid
        LEFT JOIN router_switch rs
        ON rs.routerid = h.defaultgateway AND rs.switchid = sh.switchid
        INNER JOIN switch s
        ON s.switchid = sh.switchid
        WHERE h.projectid = $1;
    `;

    return (await postgres.query<HostInfo>(query, [projectId]));
}

export async function retrieveServerInfo(projectId: number): Promise<Server | null> {
    const query = `
        SELECT serverid, servername, ip, rootcredential FROM server WHERE serverid = (
            SELECT serverid FROM project WHERE projectid = $1
        );
    `;

    return (await postgres.query<Server>(query, [projectId])).pop() ?? null;
}

export async function retrieveInterfaces(routerId: number): Promise<Interfaces | null> {
    const query = `
        SELECT
            json_object_agg(q2.interfacename, q2.ip) as interfaces
        FROM (
            SELECT
                q1.interfacename,
                json_agg(q1.ip) as ip
            FROM (
                SELECT
                    interfacename,
                    jsonb_object_keys(configuration) as ip
                FROM router_switch
                WHERE routerid = $1
            ) q1
            GROUP BY interfacename
        ) q2;
    `;
    const result = (await postgres.query<{ interfaces: Interfaces }>(query, [routerId])).pop();
    return result? result.interfaces : null;
}

export async function checkProjectGenerated(projectId: number): Promise<number> {
    const query = `
        SELECT generated FROM project WHERE projectid = $1;
    `;

    const generated = (await postgres.query<{ generated: boolean }>(query, [projectId])).pop()?.generated;
    return generated !== undefined ? Number(generated) : -1;
}

export async function updateProjectGenerated(projectId: number, generated: boolean): Promise<void> {
    const query = `
        UPDATE project
        SET generated = $2
        WHERE projectid = $1;
    `;

    await postgres.query(query, [projectId, generated]);
}

export async function updateReady(projectId: number, ready: boolean): Promise<void> {
    const query = `
        UPDATE project
        SET ready = $2
        WHERE projectid = $1;
    `;

    await postgres.query(query, [projectId, ready]);
}

export async function checkProjectReady(projectId: number): Promise<number> {
    const query = `
        SELECT ready FROM project WHERE projectid = $1;
    `;

    const ready = (await postgres.query<{ ready: boolean }>(query, [projectId])).pop()?.ready;
    return ready !== undefined ? Number(ready) : -1;
}

async function checkInterfaceId(projectId: number, routerId: number): Promise<number> {
    const query = `
        SELECT COUNT(portname) as id FROM router_switch WHERE projectid = $1 AND routerid = $2;
    `;

    const id = (await postgres.query<{id: number}>(query,[projectId, routerId])).pop()?.id;
    return id ? id + 2 : 2;
}

export async function retrieveONOSPortConfiguration(projectId: number): Promise<ONOSConfig[]> {
    const query = `
        SELECT
            q2.routername, q1.switchname, rs.portname, q3.source, q3.configuration ->> q3.source as subnet, rs.peer, rs.interfacename
        FROM router_switch rs
        JOIN LATERAL (
            SELECT switchid, switchname FROM switch
            WHERE controller = true
        ) q1 ON q1.switchid = rs.switchid
        JOIN LATERAL (
            SELECT routerid, routername FROM router
        ) q2 ON q2.routerid = rs.routerid
        LEFT JOIN LATERAL (
            SELECT routerid, jsonb_object_keys(configuration) as source, configuration FROM router_switch
            WHERE peer IS NOT NULL
        ) q3 ON q3.routerid = rs.routerid
        WHERE projectid = $1
        GROUP BY q2.routername, q1.switchname, rs.portname, q3.source, rs.peer, rs.interfacename, q3.configuration;
    `;

    return (await postgres.query<ONOSConfig>(query, [projectId]));
}

export async function retrieveBGPConfiguration(projectId: number): Promise<BGPConfig[]> {
    const query = `
        SELECT
            routername,
            q1.bgp
        FROM router r
        JOIN LATERAL (
            SELECT routerid, json_agg(json_build_object(
                'asnumber', asnumber,
                'bgprouterid', bgprouterid,
                'neighbour', neighbour,
                'network', network
            )) as bgp
            FROM bgp_configuration
            GROUP BY routerid
        ) q1 ON r.routerid = q1.routerid
        WHERE projectid = $1;
    `;

    return (await postgres.query<BGPConfig>(query, [projectId]));
}