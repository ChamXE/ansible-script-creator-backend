import type e from 'express';
import logger from 'logger';
import fs from 'fs';
import * as project from '@/services/postgres/project';
import { success, failure } from '@/api/util';
import { Project, RouterSwitch, SwitchHost, SwitchSwitch } from '@/types/postgres/project';
import * as AnsibleScript from "@/services/execution/ansible-scripts";
import { sleep } from "@/util";

const log = logger('API', 'PROJECT');
const hostFilePath = './execution';
if (!fs.existsSync(hostFilePath)) fs.mkdirSync(hostFilePath, { recursive: true });

export async function retrieveProjects(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveProjects(request.params.username);
        success(response, { project: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createProject(request: e.Request, response: e.Response): Promise<void> {
    try {
        const p: Project = request.body;
        await project.createProject(p);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteProject(request: e.Request, response: e.Response): Promise<void> {
    try {
        const projectId = +request.params.projectId;
        const server = await project.retrieveServerInfo(projectId);
        if(!server) {
            success(response, { result: false });
            return;
        }
        const { rootcredential, ip } = server;
        const { username, password } = rootcredential;
        const generated = await project.checkProjectGenerated(projectId);
        if(generated === 1) {
            const result = await generateHostFile(projectId, ip);
            if(!result) {
                success(response, { result: false });
                return;
            }
            const deleteHostResult = await AnsibleScript.deleteHost(projectId, username, password);
            if(deleteHostResult) {
                success(response, { result: false });
                return;
            }
            const deleteVMResult = await AnsibleScript.deleteVM(projectId, username, password);
            if(deleteVMResult) {
                success(response, { result: false });
                return;
            }
            const deleteOVSResult = await AnsibleScript.deleteOVS(projectId, username, password);
            if(deleteOVSResult) {
                success(response, { result: false });
                return;
            }
        }
        // await project.deleteProject(projectId);
        success(response, { result: true });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveRouterSwitch(+request.params.projectId);
        success(response, { connection: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveSwitchSwitch(+request.params.projectId);
        success(response, { connection: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function retrieveSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const result = await project.retrieveSwitchHost(+request.params.projectId);
        success(response, { connection: result });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const routerSwitch: RouterSwitch = request.body;
        await project.createRouterSwitch(routerSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const switchSwitch: SwitchSwitch = request.body;
        await project.createSwitchSwitch(switchSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function createSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const switchHost: SwitchHost = request.body;
        await project.createSwitchHost(switchHost);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const {
            projectId,
            routerId,
            switchId
        } = request.params;
        await project.deleteRouterSwitch(+projectId, +routerId, +switchId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const {
            projectId,
            switchId_src,
            switchId_dst
        } = request.params;
        await project.deleteSwitchSwitch(+projectId, +switchId_src, +switchId_dst);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function deleteSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const {
            projectId,
            switchId,
            hostId
        } = request.params;
        await project.deleteSwitchHost(+projectId, +switchId, +hostId);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function updateRouterSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const oldRouterSwitch: RouterSwitch = request.body.oldConnectionInfo;
        const newRouterSwitch: RouterSwitch = request.body.newConnectionInfo;
        await project.updateRouterSwitch(oldRouterSwitch, newRouterSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function updateSwitchSwitch(request: e.Request, response: e.Response): Promise<void> {
    try {
        const oldSwitchSwitch: SwitchSwitch = request.body.oldConnectionInfo;
        const newSwitchSwitch: SwitchSwitch = request.body.newConnectionInfo;
        await project.updateSwitchSwitch(oldSwitchSwitch, newSwitchSwitch);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function updateSwitchHost(request: e.Request, response: e.Response): Promise<void> {
    try {
        const oldSwitchHost: SwitchHost = request.body.oldConnectionInfo;
        const newSwitchHost: SwitchHost = request.body.newConnectionInfo;
        await project.updateSwitchHost(oldSwitchHost, newSwitchHost);
        success(response);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function generateProject(request: e.Request, response: e.Response): Promise<void> {
    try {
        const projectId = +request.params.projectId;
        const server = await project.retrieveServerInfo(projectId);
        if(!server) {
            success(response, { result: false });
            return;
        }
        const { rootcredential, ip } = server;
        const { username, password } = rootcredential;
        const generated = await project.checkProjectGenerated(projectId);
        if(generated === 1) {
            success(response, { result: false });
            return;
        }
        const result = await generateHostFile(projectId, ip);
        if(!result) {
            success(response, { result: false });
            return;
        }
        success(response, { result: true });
        const createVMResult = await AnsibleScript.createVM(projectId, username, password);
        if(createVMResult) {
            success(response, { result: false });
            return;
        }
        const setupOVSResult = await AnsibleScript.setupOVS(projectId, username, password);
        if(setupOVSResult) {
            success(response, { result: false });
            return;
        }
        const upVMResult = await AnsibleScript.onVM(projectId, username, password);
        if(upVMResult) {
            success(response, { result: false });
            return;
        }
        await sleep(4 * 60 * 1000);
        const getIPResult = await AnsibleScript.getIP(projectId, username, password);
        if(getIPResult) {
            success(response, { result: false });
            return;
        }
        const configRouterResult = await AnsibleScript.configRouter(projectId, username, password);
        if(configRouterResult) {
            success(response, { result: false });
            return;
        }
        const createHostResult = await AnsibleScript.createHost(projectId, username, password);
        if(createHostResult) {
            success(response, { result: false });
            return;
        }
        await project.updateProjectGenerated(projectId);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

async function generateHostFile(projectId: number, ip: string): Promise<number> {
    const routerInfo = await project.retrieveRouterInfo(projectId);
    const switchInfo = await project.retrieveSwitchInfo(projectId);
    const hostInfo = await project.retrieveHostInfo(projectId);
    let hostFile = `all:\n${whitespace(2)}children:\n${whitespace(4)}network:\n`;
    hostFile += `${whitespace(6)}hosts:\n${whitespace(8)}${ip}:\n`;
    hostFile += `${whitespace(10)}ansible_python_interpreter: /usr/bin/python3.6\n${whitespace(10)}vms:\n`
    routerInfo.forEach((router) => {
        hostFile += `${whitespace(12)}- name: ${router.routername}\n`;
        hostFile += `${whitespace(14)}sdn_ip: ${router.ip}\n`;
        hostFile += `${whitespace(14)}mask: ${router.subnet}\n`;
        hostFile += `${whitespace(14)}port: ${router.portname}\n`;
        if(router.users.length) {
            hostFile += `${whitespace(14)}users:\n`;
            router.users.forEach(({ username, password, privilege }) => {
               hostFile += `${whitespace(16)}- username: ${username}\n`;
               hostFile += `${whitespace(18)}password: ${password}\n`;
               hostFile += `${whitespace(18)}privilege: ${privilege}\n`;
            });
        }
        hostFile += `${whitespace(14)}routes:\n`;
        if(router.routes.length) {
            router.routes.forEach((route) => {
                hostFile += `${whitespace(16)}- prefix: ${route.prefix}\n`;
                hostFile += `${whitespace(18)}mask: ${route.mask}\n`;
                if(route.exitGateway) hostFile += `${whitespace(18)}exitGateway: ${route.exitGateway}\n`;
                if(route.exitInterface) hostFile += `${whitespace(18)}exitInterface: ${route.exitInterface}\n`;
                if(route.metric) hostFile += `${whitespace(18)}metric: ${route.metric}\n`;
            });
        }
        else {
            hostFile += `${whitespace(16)}- prefix: 0.0.0.0\n`;
            hostFile += `${whitespace(18)}mask: 0.0.0.0\n`;
            hostFile += `${whitespace(18)}exitInterface: GigabitEthernet2\n`;
        }
    });
    hostFile += `${whitespace(10)}ovs:\n`;
    switchInfo.forEach((switchR) => {
        hostFile += `${whitespace(12)}- name: ${switchR.switchname}\n`;
        hostFile += `${whitespace(14)}controller: ${switchR.controller}\n`;
        if(switchR.access.length) {
            hostFile += `${whitespace(14)}access:\n`;
            switchR.access.forEach((port) => {
                hostFile += `${whitespace(16)}- ${port}\n`;
            });
        }
        if(!(switchR.patch.length === 1 && !switchR.patch[0].peer)) {
            hostFile += `${whitespace(14)}patch:\n`;
            switchR.patch.forEach(({patch, peer}) => {
                hostFile += `${whitespace(16)}- name: ${patch}\n`;
                hostFile += `${whitespace(18)}peer: ${peer}\n`;
            });
        }
    });
    if(hostInfo.length) {
        hostFile += `${whitespace(10)}namespaces:\n`;
        hostInfo.forEach((host) => {
            hostFile += `${whitespace(12)}- name: ${host.hostname}\n`;
            hostFile += `${whitespace(14)}ip: ${host.ip}\n`;
            hostFile += `${whitespace(14)}mask: ${host.subnet}\n`;
            hostFile += `${whitespace(14)}ovs: ${host.ovs}\n`;
            hostFile += `${whitespace(14)}ovsportname: ${host.ovsportname}\n`;
            hostFile += `${whitespace(14)}hostportname: ${host.hostportname}\n`;
            hostFile += `${whitespace(14)}defaultgateway: ${host.defaultgateway}\n`;
        });
    }
    hostFile += `${whitespace(4)}ungrouped: {}\n`;
    fs.writeFile(`${hostFilePath}/${projectId}.yaml`, hostFile, (err) => {
        if(err) {
            log.error('Host file generation failed!');
            return 0;
        }
        log.info('Host file generated successfully!');
    });
    return 1;
}

function whitespace(n: number): string {
    return new Array(n + 1).join(' ');
}