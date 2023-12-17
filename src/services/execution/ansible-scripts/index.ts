import { exec, execFile } from 'child_process';
import os from 'os';
import logger from "logger";
import {ManagementIP} from "~/execution";

const log = logger('AnsibleExec');

export async function createVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, '1-createVM.yml']);
    if(!result) return 0;
    return 1;
}

export async function setupOVS(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, '2-setup.yml']);
    if(!result) return 0;
    return 1;
}

export async function onVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, '3-upVM.yml']);
    if(!result) return 0;
    return 1;
}

export async function getIP(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, '4-getIP.yml']);
    if(!result) return 0;
    return 1;
}

export async function configRouter(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, '5-configRouter.yml']);
    if(!result) return 0;
    return 1;
}

export async function createHost(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, '6-createHost.yml']);
    if(!result) return 0;
    return 1;
}

export async function deleteHost(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'deleteHost.yml']);
    if(!result) return 0;
    return 1;
}

export async function deleteOVS(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'deleteOVS.yml']);
    if(!result) return 0;
    return 1;
}

export async function deleteVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'deleteVM.yml']);
    if(!result) return 0;
    return 1;
}

export async function deleteONOSConfig(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'deleteONOSConfig.yml']);
    if(!result) return 0;
    return 1;
}

export async function configureBGP(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'configBGP.yml']);
    if(!result) return 0;
    return 1;
}

export async function annotateDevice(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'annotateFriendlyName.yml']);
    if(!result) return 0;
    return 1;
}

export async function configureONOS(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'configONOS.yml']);
    if(!result) return 0;
    return 1;
}

export async function offVM(projectId: number, username: string, password: string): Promise<number> {
    const result = await executeCommand('./script.exp', undefined, [username, password, `${projectId}.yaml`, 'downVM.yml']);
    if(!result) return 0;
    return 1;
}

export async function readIP(projectId: number): Promise<ManagementIP> {
    const toReturn: ManagementIP = {};
    const routername = (await execCommand(
        `cat ${projectId}.yaml | grep -zoP 'name:\\K.*?(?=\\n.*vbox_ip)' | awk '{n=split($0,array," "); for(i=1;i<=n;i++) print array[i] }'`
    )).replace(/\0/g, '').split(/\r?\n/);

    const routerip = (await execCommand(
        `cat ${projectId}.yaml | grep -zoP 'name:\\K(.*)\\n.*vbox_ip:\\K(.*)' | awk '{n=split($0,array," "); for(i=1;i<=n;i++) print array[i] }'`
    )).replace(/\0/g, '').split(/\r?\n/);

    routername.pop();
    routerip.pop();

    for(let i = 0; i < routername.length; i++) {
        toReturn[routername[i]] = {
            management: routerip[i]
        };
    }
    return toReturn;
}

async function execCommand(cmd: string, cwd = `${os.homedir()}/website/backend/execution`, args?: string[]): Promise<string> {
    return new Promise(resolve => {
       exec(
           cmd,
           { cwd: cwd },
           function (error, stdout, stderr) {
               let code;
               // log.info('stdout', stdout);
               if(error){
                   code = `${error.code}` ?? '1';
                   log.error('Code:', error.code);
                   log.error('Message:', error.message);
                   if(stderr.length) log.error(stderr);
               }
               else code = stdout;
               resolve(code);
           }
       )
    });
}

async function executeCommand(cmd: string, cwd = `${os.homedir()}/fyp`, args?: string[]): Promise<string | number> {
    return new Promise(resolve => {
        execFile(
            cmd,
            args? [...args] : undefined,
            { cwd: cwd },
            function (error, stdout, stderr) {
                let code;
                // log.info('stdout', stdout);
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