import { Client as DjsClient } from 'discord.js';

export class Client extends DjsClient {
    public version = `${{ hm: 'hm', nm: 'nm', undefined: 'beta' }[process.argv[2]]}` as 'hm' | 'nm' | 'beta' | 'undefined';
    public beta = this.version === 'beta' || this.version === 'undefined';
    public get embedColor(): number {
        return { hm: 0xafbbea, nm: 0xa2e0ea, beta: 0xf6e47f, undefined: 0x000000 }[this.version] as number;
    }
    public get rgbColor(): string {
        return { hm: '175,187,234', nm: '162,224,234', beta: '246,228,127', undefined: '256,256,256' }[this.version] as string;
    }
    public get consoleColor(): string {
        return ('\x1b[38;2;' + { hm: '175;187;234m', nm: '162;224;234m', beta: '246;228;127m', undefined: '256;256;256m' }[this.version]) as string;
    }
    public timeCode(type?: 'error'): string {
        return `\x1b[${type === 'error' ? '31m' : '36m'}[${new Date().toLocaleString()}] ${this.consoleColor}[${this.version.toUpperCase()}]\x1b[0m`;
    }
}
