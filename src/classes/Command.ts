import type {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    Collection,
    Message,
    PermissionResolvable,
    TextInputComponent,
} from 'discord.js';
import type { Client } from './Client';

export class Command {
    public name = '';
    public description = '';
    public options: ChatInputApplicationCommandData['options'] = [];
    public default_member_permissions? = '';
    public dm_permission = true;
    public nsfw = false;
    public aliases: Array<string> = [];
    public cooldown = 2_000;
    public category = '';
    public disabled = false;
    public deferReply = true;
    public permissions?: Array<PermissionResolvable> = [];
    public prefixCommand?: (data: { message: Message; args: Array<string>; client: Client }) => Promise<unknown>;
    public slashCommand?: (data: {
        interaction: ChatInputCommandInteraction;
        hidden: boolean;
        options: ChatInputCommandInteraction['options'];
        client: Client;
    }) => Promise<unknown>;
    public button?: (interaction: ButtonInteraction) => Promise<unknown>;
    public selectMenu?: (interaction: AnySelectMenuInteraction) => Promise<unknown>;
    public modal?: (interaction: Message, fields: Collection<string, TextInputComponent>) => Promise<unknown>;
    constructor(data: CommandData) {
        this.name = data.name;
        this.description = data.description;
        this.options = data.options || [];
        this.default_member_permissions = data.default_member_permissions;
        this.dm_permission = data.dm_permission || true;
        this.nsfw = data.nsfw || false;
        this.aliases = data.aliases || [];
        this.cooldown = data.cooldown || 2_000;
        this.category = data.category;
        this.disabled = data.disabled || false;
        this.deferReply = data.deferReply || true;
        this.permissions = data.permissions;
        this.prefixCommand = data.prefixCommand;
        this.slashCommand = data.slashCommand;
        this.button = data.button;
        this.selectMenu = data.selectMenu;
        this.modal = data.modal;
    }
    public get applicationData() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            default_member_permissions: this.default_member_permissions,
            dm_permission: this.dm_permission,
            nsfw: this.nsfw,
        };
    }
}

interface CommandData {
    name: string;
    description: string;
    options?: ChatInputApplicationCommandData['options'];
    default_member_permissions?: string;
    dm_permission?: boolean;
    nsfw?: boolean;
    aliases?: Array<string>;
    /**Cooldown in ms */
    cooldown?: number;
    category: string;
    disabled?: boolean;
    deferReply?: boolean;
    permissions?: Array<PermissionResolvable>;
    prefixCommand?: (data: { message: Message; args: Array<string>; client: Client }) => Promise<unknown>;
    slashCommand?: (data: { interaction: ChatInputCommandInteraction; hidden: boolean; options: ChatInputCommandInteraction['options']; client: Client }) => Promise<unknown>;
    button?: (interaction: ButtonInteraction) => Promise<unknown>;
    selectMenu?: (interaction: AnySelectMenuInteraction) => Promise<unknown>;
    modal?: (interaction: Message, fields: Collection<string, TextInputComponent>) => Promise<unknown>;
}
