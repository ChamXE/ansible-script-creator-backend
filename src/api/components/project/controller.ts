import type e from 'express';
import logger from 'logger';
import fs from 'fs';
import * as project from '@/services/postgres/project';
import * as service from '@/services/postgres/service';
import * as device from '@/services/postgres/device';
import { success, failure } from '@/api/util';
import { Project, RouterSwitch, SwitchHost, SwitchSwitch } from '@/types/postgres/project';
import * as AnsibleScript from "@/services/execution/ansible-scripts";
import { sleep, Subnet } from "@/util";

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
        const destroyProjectResult = await destroyProjectBehind(projectId);
        if(destroyProjectResult !== 0 && destroyProjectResult !== -2) {
            success(response, { result: false });
            return;
        }
        console.log('test');
        await project.deleteProject(projectId);
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

export async function retrieveInterfaces(request: e.Request, response: e.Response): Promise<void> {
    try {
        const interfaces = await project.retrieveInterfaces(+request.params.routerId);
        success(response, { interfaces: interfaces });
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
        if(generated !== 0) {
            success(response, { result: false });
            return;
        }
        const result = await generateHostFile(projectId, ip);
        if(!result) {
            success(response, { result: false });
            return;
        }
        success(response, { result: true });
        await project.updateProjectGenerated(projectId, true);
        const createVMResult = await AnsibleScript.createVM(projectId, username, password);
        if(createVMResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        const setupOVSResult = await AnsibleScript.setupOVS(projectId, username, password);
        if(setupOVSResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        const upVMResult = await AnsibleScript.onVM(projectId, username, password);
        if(upVMResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        const createHostResult = await AnsibleScript.createHost(projectId, username, password);
        if(createHostResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        const annotateDeviceResult = await AnsibleScript.annotateDevice(projectId, username, password);
        if(annotateDeviceResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        await sleep(3 * 60 * 1000);
        const getIPResult = await AnsibleScript.getIP(projectId, username, password);
        if(getIPResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        await updateManagementIP(projectId);
        const configRouterResult = await AnsibleScript.configRouter(projectId, username, password);
        if(configRouterResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        const configureBGPResult = await AnsibleScript.configureBGP(projectId, username, password);
        if(configureBGPResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        const configureONOSResult = await AnsibleScript.configureONOS(projectId, username, password);
        if(configureONOSResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        const configureIntentResult = await AnsibleScript.configureIntent(projectId, username, password);
        if(configureIntentResult) {
            await project.updateProjectGenerated(projectId, false);
            return;
        }
        await project.updateReady(projectId, true);
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

export async function destroyProject(request: e.Request, response: e.Response): Promise<void> {
    try {
        const projectId = +request.params.projectId;
        const destroyProjectResult = await destroyProjectBehind(projectId);
        if(destroyProjectResult !== 0) {
            success(response, { result: false });
            return;
        }
        success(response, { result: true });
    } catch (e) {
        log.error(e);
        failure(response, e);
    }
}

async function destroyProjectBehind(projectId: number): Promise<number> {
    const server = await project.retrieveServerInfo(projectId);
    if(!server) {
        return 1;
    }
    const routerInfo = await project.retrieveRouterInfo(projectId);
    const { rootcredential, ip } = server;
    const { username, password } = rootcredential;
    const generated = await project.checkProjectGenerated(projectId);
    const ready = await project.checkProjectReady(projectId);
    if(generated === 1 && ready === 1) {
        const deleteIntentResult = await AnsibleScript.deleteIntent(projectId, username, password);
        if(deleteIntentResult) {
            return 1;
        }
        const deleteONOSConfigResult = await AnsibleScript.deleteONOSConfig(projectId, username, password);
        if(deleteONOSConfigResult) {
            return 1;
        }
        const deleteHostResult = await AnsibleScript.deleteHost(projectId, username, password);
        if(deleteHostResult) {
            return 1;
        }
        const deleteVMResult = await AnsibleScript.deleteVM(projectId, username, password);
        if(deleteVMResult) {
            return 1;
        }
        for(let i = 0; i < routerInfo.length; i++) {
            await device.updateManagementIP(routerInfo[i].routerid, null);
        }
        const deleteOVSResult = await AnsibleScript.deleteOVS(projectId, username, password);
        if(deleteOVSResult) {
            return 1;
        }
        await project.updateProjectGenerated(projectId, false);
        await project.updateReady(projectId, false);
        return 0;
    }
    else if(generated === 0) {
        log.error('Project not generated!');
        return -2;
    }
    else {
        log.error('Project does not exist!');
        return -1;
    }
}

async function generateHostFile(projectId: number, ip: string): Promise<number> {
    const routerInfo = await project.retrieveRouterInfo(projectId);
    const switchInfo = await project.retrieveSwitchInfo(projectId);
    const hostInfo = await project.retrieveHostInfo(projectId);
    const portConfig = await project.retrieveONOSPortConfiguration(projectId);
    const bgpConfig = await project.retrieveBGPConfiguration(projectId);
    const customIntent = await service.retrieveCustomIntent(projectId);
    let hostFile = `all:\n${whitespace(2)}children:\n${whitespace(4)}network:\n`;
    hostFile += `${whitespace(6)}hosts:\n${whitespace(8)}${ip}:\n`;
    hostFile += `${whitespace(10)}ansible_python_interpreter: /usr/bin/python3.6\n${whitespace(10)}vms:\n`
    routerInfo.forEach((router) => {
        hostFile += `${whitespace(12)}- name: ${router.routername}\n`;
        const ovsports = Object.keys(router.ports);
        if(ovsports.length) {
            hostFile += `${whitespace(14)}ports:\n`;
            ovsports.forEach((port) => {
                hostFile += `${whitespace(16)}- ${port}\n`;
            });
            hostFile += `${whitespace(14)}configuration:\n`;
            ovsports.forEach((port) => {
                router.ports[port].forEach(({ ip, subnet, name }) => {
                    hostFile += `${whitespace(16)}- ip: ${ip}\n`;
                    hostFile += `${whitespace(18)}subnet: ${subnet}\n`;
                    hostFile += `${whitespace(18)}name: ${name}\n`;
                })
            });
        }
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
        if(switchR.controller) hostFile += `${whitespace(14)}controller: ${switchR.controller}\n`;
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
    if(portConfig.length) {
        hostFile += `${whitespace(10)}interfaces:\n`;
        portConfig
            .filter(({ peer }) => peer !== null)
            .forEach(({ portname, switchname, source, peer, subnet }) => {
            hostFile += `${whitespace(12)}- portname: ${portname}\n`;
            hostFile += `${whitespace(14)}switchname: ${switchname}\n`;
            hostFile += `${whitespace(14)}source: ${source}\n`;
            hostFile += `${whitespace(14)}peer: ${peer}/${Subnet[subnet!]}\n`;
        });
        hostFile += `${whitespace(10)}bgpspeaker:\n`;
        portConfig
            .filter(({ peer }) => peer === null)
            .forEach(({ portname, routername, switchname, interfacename }) => {
                hostFile += `${whitespace(12)}- portname: ${portname}\n`;
                hostFile += `${whitespace(14)}routername: ${routername}\n`;
                hostFile += `${whitespace(14)}switchname: ${switchname}\n`;
                hostFile += `${whitespace(14)}interfacename: ${interfacename}\n`;
            });
    }
    if(bgpConfig.length) {
        hostFile += `${whitespace(10)}bgp:\n`;
        bgpConfig.forEach(({ routername, bgp }) => {
            const currentRouter = routername;
            const port = portConfig.filter(({ routername }) => routername === currentRouter);
            if(bgp[0].asnumber) {
                hostFile += `${whitespace(12)}${routername}:\n`;
                bgp.forEach(({ asnumber, bgprouterid, neighbour, network }) => {
                    hostFile += `${whitespace(14)}asnumber: ${asnumber}\n`;
                    if(bgprouterid) hostFile += `${whitespace(14)}bgprouterid: ${bgprouterid}\n`;
                    hostFile += `${whitespace(14)}neighbour:\n`;
                    neighbour!.forEach(({ id, remoteas, ebgpmultihop }, idx) => {
                        hostFile += `${whitespace(16)}- id: ${id}\n`;
                        hostFile += `${whitespace(18)}remoteas: ${remoteas}\n`;
                        if(ebgpmultihop) hostFile += `${whitespace(18)}ebgpmultihop: 255\n`;
                        if(idx === neighbour!.length - 1 && !port[0].peer) {
                            hostFile += `${whitespace(16)}- id: 192.168.56.1\n`;
                            hostFile += `${whitespace(18)}remoteas: ${asnumber}\n`;
                        }
                    })
                    if(network) hostFile += `${whitespace(14)}network:\n`;
                    network?.forEach(({ ip, mask }) => {
                        hostFile += `${whitespace(16)}- ip: ${ip}\n`;
                        hostFile += `${whitespace(18)}mask: ${mask}\n`;
                    })
                })
            }
        });
    }
    if(customIntent.length) {
        hostFile += `${whitespace(10)}intents:\n`;
        customIntent.forEach((intent) => {
            const { source, destination, intermediate, sourcekey, destkey, protocol, ethertype } = intent;
            const length = intermediate.length;
            for(let i = 0; i < length; i++) {
                if(i === 0) {
                    hostFile += `${whitespace(12)}- ingress: ${source + intermediate[i]}\n`;
                }
                else {
                    hostFile += `${whitespace(12)}- ingress: ${intermediate[i] + intermediate[i-1]}\n`;
                }
                if(i === length - 1) {
                    hostFile += `${whitespace(14)}egress: ${destination + intermediate[i]}\n`;
                }
                else {
                    hostFile += `${whitespace(14)}egress: ${intermediate[i] + intermediate[i+1]}\n`;
                }
                hostFile += `${whitespace(14)}node: ${intermediate[i]}\n`
                hostFile += `${whitespace(14)}priority: 2500\n`;
                hostFile += `${whitespace(14)}ethertype: ${ethertype}\n`;
                if(protocol) hostFile += `${whitespace(14)}protocol: ${protocol}\n`;
                hostFile += `${whitespace(14)}sourceNet: ${sourcekey}\n`;
                hostFile += `${whitespace(14)}destNet: ${destkey}\n`;
                hostFile += `${whitespace(14)}destName: ${destination}\n`;
            }
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

async function updateManagementIP(projectId: number): Promise<void> {
    const managementIPs = await AnsibleScript.readIP(projectId);
    const routerInfo = await project.retrieveRouterInfo(projectId);
    const routers = Object.keys(managementIPs);
    routers.forEach((router) => {
        managementIPs[router].routerid = routerInfo.filter(({ routername }) => routername === router)![0].routerid;
    })
    for(let i = 0; i < routers.length; i++) {
        const { routerid, management } = managementIPs[routers[i]];
        await device.updateManagementIP(routerid!, management);
    }
}

function whitespace(n: number): string {
    return new Array(n + 1).join(' ');
}