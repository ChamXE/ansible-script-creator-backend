import * as postgres from '@/services/postgres';
import { Project, RouterSwitch, SwitchSwitch, SwitchHost } from '~/postgres/project';

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