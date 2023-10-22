import { execFile } from 'child_process';
import os from 'os';
import logger from "logger";

const log = logger('AnsibleExec');

export async function createVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, '1-createVM.yml']);
    if(!result) return 0;
    return 1;
}

export async function setupOVS(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, '2-setup.yml']);
    if(!result) return 0;
    return 1;
}

export async function onVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, '3-upVM.yml']);
    if(!result) return 0;
    return 1;
}

export async function getIP(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, '4-getIP.yml']);
    if(!result) return 0;
    return 1;
}

export async function configRouter(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, '5-configRouter.yml']);
    if(!result) return 0;
    return 1;
}

export async function createHost(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, '6-createHost.yml']);
    if(!result) return 0;
    return 1;
}

export async function deleteHost(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, 'deleteHost.yml']);
    if(!result) return 0;
    return 1;
}

export async function deleteOVS(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, 'deleteOVS.yml']);
    if(!result) return 0;
    return 1;
}

export async function deleteVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, 'deleteVM.yml']);
    if(!result) return 0;
    return 1;
}

export async function offVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', [username, password, `${projectId}.yaml`, 'downVM.yml']);
    if(!result) return 0;
    return 1;
}

async function executeCommand(cmd: string, args: string[]): Promise<string | number> {
    return new Promise(resolve => {
        execFile(
            cmd,
            [...args],
            { cwd: `${os.homedir()}/fyp` },
            function (error, stdout, stderr) {
                let code;
                if(error){
                    code = error.code ?? 1;
                    log.error('Code:', error.code);
                    log.error('Message:', error.message);
                    if(stderr.length) log.error(stderr);
                }
                else code = 0;
                resolve(code);
            }
        )
    });
}