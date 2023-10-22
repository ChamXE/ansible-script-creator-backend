import { NodeSSH, SSHExecCommandOptions, SSHExecCommandResponse } from "node-ssh";
import { SSHResponse }from '~/execution'

export class Server {

    private ssh = new NodeSSH();
    private username: string;
    private password: string;
    private host: string;

    constructor(username: string, password: string, host: string) {
        this.username = username;
        this.password = password;
        this.host = host;
    }

    private async connect(): Promise<void> {
        await this.ssh.connect({
            host: this.host,
            username: this.username,
            password: this.password
        });
    }

    private async exec(command: string, sudo = true, cwd?: string): Promise<SSHExecCommandResponse> {
        const options: SSHExecCommandOptions = {};
        if(cwd) options["cwd"] = cwd;
        if(sudo) {
            options["stdin"] = `${this.password}\n`;
            options["execOptions"] = {
                pty: true
            };
        }

        return (await this.ssh.execCommand(command, { ...options }));
    }
    async executeCommand(command: string, sudo = true, cwd?: string): Promise<SSHResponse> {
        await this.connect();
        const result = await this.exec(command, sudo, cwd);
        this.ssh.dispose();
        const message = result.code ? (result.stderr.length ? result.stderr : result.stdout) : result.stdout;
        return {
            code: result.code,
            message: sudo ? message.slice(this.password.length + 2 + 20 + this.username.length + 4) : message
        };
    }
}