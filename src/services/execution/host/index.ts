import servers from '@/services/execution/';
import {SSHResponse} from "~/execution";
import {Host} from "~/postgres/device";
import {setInterfaceUp} from "@/services/execution/switch";

const namespaceExec = 'sudo ip netns exec ';
const missingError: SSHResponse = {
    code: 3,
    message: 'Missing data!'
};
export async function createHost(serverId: number, hostName: string): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `sudo ip netns add ${hostName}`,
    ));
}

export async function addConnection(
    serverId: number,
    hostName: string,
    switchPortName: string,
    hostPortName: string
): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        `sudo ip link add ${switchPortName} type veth peer name ${hostPortName} netns ${hostName}`,
    ));
}

export async function configInterface(serverId: number, hostInfo: Host, hostPortName: string): Promise<SSHResponse> {
    const { hostname, ip, subnet } = hostInfo;
    if(!ip) return missingError;
    if(!subnet) return missingError;
    const configIntfResult = (await servers[serverId].executeCommand(
        namespaceExec + `${hostname} ifconfig ${hostPortName} ${ip} netmask ${subnet}`,
    ));
    if(!configIntfResult.code) return (await setInterfaceUp(serverId, hostPortName));
    return configIntfResult;
}

export async function configDefaultGateway(
    serverId: number,
    hostName: string,
    gatewayIP: string,
    hostPortName: string
): Promise<SSHResponse> {
    return (await servers[serverId].executeCommand(
        namespaceExec + `${hostName} route add default gw ${gatewayIP} dev ${hostPortName}`,
    ));
}