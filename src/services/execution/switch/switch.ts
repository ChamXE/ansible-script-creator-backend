import servers from '@/services/execution/';
import { Switch } from "~/postgres/device";
import {SSHResponse} from "~/execution";

export async function setInterfaceUp(serverId:number, interfaceName: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `sudo ip link set ${interfaceName} up`,
    ));
}

export async function addBridge(serverId: number, switchInfo: Switch): Promise<SSHResponse> {
    const { switchname, controller  } = switchInfo
    const createBridgeResult = await servers[serverId].executeCommand(
        `sudo ovs-vsctl add-br ${switchname} -- set bridge ${switchname}`,
    );
    if(!createBridgeResult.code) {
        const setControllerResult = await setController(serverId, switchname, controller);
        if(!setControllerResult.code) {
            return (await setInterfaceUp(serverId, switchname));
        }
        return setControllerResult;
    }
    return createBridgeResult;
}

export async function setController(serverId: number, switchName: string, controller: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `sudo ovs-vsctl set-controller ${switchName} tcp:${controller}:6633`,
    ));
}

export async function addPort(
    serverId: number,
    switchName: string,
    portName: string,
    type = 'internal',
    peer?: string,
    remoteIP?: string
): Promise<SSHResponse> {
    let command = `sudo ovs-vsctl add-port ${switchName} ${portName} -- set interface ${portName} type=`;
    switch(type) {
        case 'internal':
            command += 'internal';
            break;
        case 'vxlan':
            command += `vxlan options:remote_ip=${remoteIP}`;
            break;
        case 'patch':
            command += `patch options:peer=${peer}`;
            break;
        default:
            break;
    }
    const addPortResult = await servers[serverId].executeCommand(
        command,
    );
    if(!addPortResult.code) return (await setInterfaceUp(serverId, portName));
    return addPortResult;
}

export async function deleteBridge(serverId: number, switchName: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `sudo ovs-vsctl del-br ${switchName}`,
    ));
}

export async function deletePort(serverId: number, switchName: string, portName: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `sudo ovs-vsctl del-port ${switchName} ${portName}`,
    ));
}