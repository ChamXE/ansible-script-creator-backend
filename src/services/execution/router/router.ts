import servers from '@/services/execution/';
import { SSHResponse } from "~/execution";

export async function createRouter(serverId: number, routerName: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `vboxmanage import ~/"VirtualBox VMs"/CSR1000v-17.03.04-Clean.ova --vsys 0 --vmname ${routerName}`,
        false
    ));
}

export async function onRouter(serverId: number, routerName: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `vboxmanage startvm ${routerName} --type headless`,
        false
    ));
}

export async function offRouter(serverId: number, routerName: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `vboxmanage controlvm ${routerName} poweroff`,
        false
    ));
}

export async function configureBridgedInterface(
    serverId: number,
    routerName: string,
    nicNumber: number,
    portName: string
): Promise<SSHResponse> {
    if(nicNumber <= 1) {
        return {
            code: 2,
            message: 'Error! Number should be in range 2 - 8!'
        };
    }
    return (await servers[serverId].executeCommand(
        `vboxmanage modifyvm ${routerName} --nic${nicNumber} bridged --bridgeadapter${nicNumber} ${portName} --type virtio`,
        false
    ));
}