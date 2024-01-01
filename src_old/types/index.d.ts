import type { Collection } from 'discord.js';
import type { Command } from '../structures/command.js';
import type { Client as myClient } from '../structures/client.ts';
declare module 'discord.js' {
    interface Client {
        cooldowns: Collection<string, any>;
        legacyCommands: Collection<string, Command>;
    }

    interface APIInteractionGuildMember {
        voice: VoiceState;
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BETATOKEN: string;
            HMTOKEN: string;
            MMTOKEN: string;
            MONGOURI: string;
            NMTOKEN: string;
            TENOR_KEY: string;
        }
    }
}
