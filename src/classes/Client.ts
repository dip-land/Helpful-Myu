import { type ClientOptions, Collection, Client as DjsClient, Routes } from 'discord.js';
import { glob } from 'glob';
import type { Event } from './Event.js';
import { type Command } from './Command.js';
import 'dotenv/config';

export class Client extends DjsClient {
    public readonly version = (process.argv.find((v) => /(hm)|(nm)/.test(v)) || 'beta') as 'hm' | 'nm' | 'beta';
    public readonly cooldowns: Collection<string, Collection<string, number>> = new Collection();
    public readonly prefixCommands: Collection<string, Command> = new Collection();
    public readonly slashCommands: Collection<string, Command> = new Collection();

    public readonly consoleColor = '\x1b[38;2;' + { hm: '175;187;234m', nm: '162;224;234m', beta: '246;228;127m' }[this.version];
    public readonly embedColor = { hm: 0xafbbea, nm: 0xa2e0ea, beta: 0xf6e47f }[this.version];
    public readonly rgbColor = { hm: '175,187,234', nm: '162,224,234', beta: '246,228,127' }[this.version];

    constructor(options: ClientOptions) {
        super(options);
    }

    public isShhh(member: any): boolean {
        return member.id === '439039443744063488';
    }

    public async registerEvents(): Promise<this> {
        for (const eventPath of (await glob('./dist/events/**/*.js', { platform: 'linux' })).toString().replaceAll('dist', '..').split(',')) {
            try {
                const event: Event = (await import(eventPath)).default;
                if (event.on) this.on(event.name, (...args) => event.fn(...args));
                else this.once(event.name, (...args) => event.fn(...args));
            } catch (err: Error | unknown) {
                this.error(eventPath, err);
            }
        }
        this.log('Events Registered.');
        return this;
    }
    public async registerCommands(servers: Array<string>): Promise<this> {
        const commands: Array<Command['applicationData']> = [];
        for (const cmdPath of (await glob('./dist/commands/**/*.js', { platform: 'linux' })).toString().replaceAll('dist', '..').split(',')) {
            try {
                const command: Command = (await import(cmdPath)).default as Command;
                this.cooldowns.set(command.name, new Collection());
                if (command.prefixCommand) this.prefixCommands.set(command.name, command);
                if (command.aliases && command.prefixCommand) for (const alias of command.aliases) this.prefixCommands.set(alias, command);
                if (command.slashCommand) commands.push(command.applicationData as never), this.slashCommands.set(command.name, command);
            } catch (err: Error | unknown) {
                this.error(cmdPath, err);
            }
        }
        for (const server of servers) {
            if (!this.user) throw new Error(`ClientUser is invalid ${this?.user}`);
            if (server === 'global') this.rest.put(Routes.applicationCommands(this.user.id), { body: commands }).catch((err) => this.error(err, server));
            else this.rest.put(Routes.applicationGuildCommands(this.user.id, server), { body: commands }).catch((err) => this.error(err, server));
        }
        this.log('Commands Registered.');
        return this;
    }
    private timeCode(type?: 'error'): string {
        return `\x1b[${type === 'error' ? '31m' : '36m'}${new Date().toLocaleString()} ${this.consoleColor}[${this.version.toUpperCase()}]\x1b[0m`;
    }
    /**Console logs data with a blue time code */
    public log(...message: any) {
        console.log(this.timeCode(), ...message);
    }
    /**Console logs data with a red time code */
    public error(...message: any) {
        console.log(this.timeCode('error'), ...message);
    }
}
