import * as postgres from '@/services/postgres';
import {Project, RouterSwitch, SwitchSwitch, SwitchHost, SwitchInfo, RouterInfo, HostInfo} from '~/postgres/project';

export async function retrieveProjects(username: string): Promise<Project[]> {
    const query = `
        SELECT * FROM project WHERE username = $1;
    `;

    return (await postgres.query<Project>(query, [username]));
}

export async function createProject({ projectid, projectname, username, serverid }: Project): Promise<void> {
    const query = `
        INSERT INTO project(projectid, projectname, username, serverid)
        VALUES (${projectid ? projectid : 'nextval(\'project_projectid_seq\')'}, $1, $2, $3)
        ON CONFLICT ON CONSTRAINT project_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                projectname = EXCLUDED.projectname,
                username = EXCLUDED.username,
                serverid = EXCLUDED.serverid;
    `;

    await postgres.query(query, [projectname, username, serverid]);
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

export async function createRouterSwitch({ projectid, routerid, switchid, portname, ip, subnet }: RouterSwitch): Promise<void> {
    const query = `
        INSERT INTO router_switch(projectid, routerid, switchid, portname, ip, subnet)
        VALUES($1, $2, $3, $4, $5, $6)
        ON CONFLICT ON CONSTRAINT router_switch_pk
        DO 
            UPDATE
            SET
                projectid = EXCLUDED.projectid,
                routerid = EXCLUDED.routerid,
                switchid = EXCLUDED.switchid,
                portname = EXCLUDED.portname,
                ip = EXCLUDED.ip,
                subnet = EXCLUDED.subnet;
    `;

    await postgres.query(query, [projectid, routerid, switchid, portname, ip, subnet]);
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
        projectid, routerid, switchid, portname, ip, subnet 
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
            ip = $5,
            subnet = $6
        WHERE projectid = $7 AND routerid = $8 AND switchid = $9;
    `;

    await postgres.query(query, [
        projectid, routerid, switchid, portname, ip, subnet, 
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
            r.routername,
            rs.portname,
            rs.ip,
            rs.subnet,
            r.configuration -> 'users' as users,
            r.configuration -> 'routes' as routes
        FROM router r
        LEFT JOIN router_switch rs
        ON r.projectid = rs.projectid AND r.routerid = rs.routerid
        WHERE r.projectid = $1
        GROUP BY r.routerid, rs.portname, rs.ip, rs.subnet;
    `;

    return (await postgres.query<RouterInfo>(query, [projectId]));
}

export async function retrieveSwitchInfo(projectId: number): Promise<SwitchInfo[]> {
    const query = `
        SELECT
            q2.switchname,
            q2.stp,
            q2.controller,
            jsonb_strip_nulls(q2.patch) as patch,
            array_remove(array_cat(access, array_agg(sh.portname)), null) as access
        FROM (
            SELECT
                q1.*,
                array_remove(array_agg(DISTINCT rs.portname), null) as access
            FROM (
                SELECT
                    s.projectid,
                    s.switchname,
                    s.switchid,
                    s.stp,
                    s.controller,
                    jsonb_agg(jsonb_strip_nulls(jsonb_build_object('patch', ss1.portname, 'peer', ss2.portname))) as patch
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
            GROUP BY q1.projectid, q1.switchid, q1.switchname, q1.stp, q1.controller, q1.patch
        ) q2
        LEFT JOIN switch_host sh
        ON q2.projectid = sh.projectid AND sh.switchid = q2.switchid
        GROUP BY q2.projectid, q2.switchname, q2.stp, q2.controller, q2.patch, q2.access;
    `;

    return (await postgres.query<SwitchInfo>(query, [projectId]));
}

export async function retrieveHostInfo(projectId: number): Promise<HostInfo[]> {
    const query = `
        SELECT
            h.hostname,
            h.ip,
            h.subnet,
            sh.portname as ovsportname,
            concat(h.hostname, '-eth0') as clientportname,
            rs.ip as defaultgateway
        FROM host h
        LEFT JOIN switch_host sh
        ON h.projectid = sh.projectid AND h.hostid = sh.hostid
        LEFT JOIN router_switch rs
        ON rs.routerid = h.default
        WHERE h.projectid = $1;
    `;

    return (await postgres.query<HostInfo>(query, [projectId]));
}

export async function retrieveServerIP(projectId: number): Promise<string> {
    const query = `
        SELECT ip FROM server WHERE serverid = (
            SELECT serverid FROM project WHERE projectid = $1
        );
    `;

    return (await postgres.query<{ ip: string }>(query, [projectId])).pop()?.ip ?? '';
}