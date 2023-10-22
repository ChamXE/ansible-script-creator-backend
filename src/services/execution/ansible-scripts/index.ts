import { execFile } from 'child_process';
import os from 'os';
import logger from "logger";

const log = logger('AnsibleExec');

export async function createVMs(projectId: number): Promise<void> {
    try {
        executeCommand('', [])
    } catch (e) {
        log.error('Code:', e.code);
        log.error('Message:', e.message);
    }
}

async function executeCommand(cmd: string, args: string[]): Promise<void> {
    execFile(
        cmd,
        [...args],
        { cwd: os.homedir() }
    )
}