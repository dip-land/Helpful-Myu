import type { VoiceState } from 'discord.js';
import type { Client as customClient } from '../classes/Client';

declare module 'discord.js' {
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
