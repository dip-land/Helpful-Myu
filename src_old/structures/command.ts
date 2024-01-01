import type {
    ButtonInteraction,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    Message,
    PermissionResolvable,
    AnySelectMenuInteraction,
    ModalSubmitInteraction,
    Collection,
    TextInputComponent,
} from 'discord.js';
import type { Client } from './client.js';
import { client } from '../index.js';

export class Command {
    #name: CommandObject['name'] = '';
    #description: CommandObject['description'] = '';
    #options?: CommandObject['options'] = [];
    #aliases: CommandObject['aliases'] = [];
    #category: CommandObject['category'] = '';
    #cooldown?: CommandObject['cooldown'] = 5;
    #disabled?: CommandObject['disabled'] = false;
    #beta?: CommandObject['beta'] = false;
    #defered?: CommandObject['defered'] = true;
    #default_member_permissions?: CommandObject['default_member_permissions'];
    #permissions?: CommandObject['permissions'] = [];
    #prefixCommand?: CommandObject['prefixCommand'];
    #slashCommand?: CommandObject['slashCommand'];
    #button?: CommandObject['button'];
    #selectMenu?: CommandObject['selectMenu'];
    #modal?: CommandObject['modal'];
    _client: Client = client;
    constructor(options: CommandObject) {
        this.#name = options.name;
        this.#description = options.description;
        this.#options = options.options;
        this.#aliases = options.aliases;
        this.#category = options.category;
        this.#cooldown = options.cooldown;
        this.#disabled = options.disabled;
        this.#beta = options.beta;
        this.#defered = options.defered || true;
        this.#default_member_permissions = options.default_member_permissions;
        this.#permissions = options.permissions;
        this.#prefixCommand = options.prefixCommand;
        this.#slashCommand = options.slashCommand;
        this.#button = options.button;
        this.#selectMenu = options.selectMenu;
        this.#modal = options.modal;
        this._client = client;
    }

    public get applicationData(): ApplicationData {
        return {
            name: this.#name,
            description: this.#description,
            options: this.#options,
            default_member_permissions: this.#default_member_permissions,
        };
    }

    public get commandObject(): CommandObject {
        return {
            name: this.#name,
            description: this.#description,
            options: this.#options,
            aliases: this.#aliases,
            category: this.#category,
            cooldown: this.#cooldown,
            disabled: this.#disabled,
            beta: this.#beta,
            defered: this.#defered,
            permissions: this.#permissions,
            prefixCommand: this.#prefixCommand,
            slashCommand: this.#slashCommand,
            button: this.#button,
            selectMenu: this.#selectMenu,
            modal: this.#modal,
        };
    }

    public get prefixCommand(): CommandObject['prefixCommand'] {
        return this.#prefixCommand as CommandObject['prefixCommand'];
    }
    public get slashCommand(): CommandObject['slashCommand'] {
        return this.#slashCommand as CommandObject['slashCommand'];
    }
    public get button(): CommandObject['button'] {
        return this.#button as CommandObject['button'];
    }
    public get selectMenu(): CommandObject['selectMenu'] {
        return this.#selectMenu as CommandObject['selectMenu'];
    }
    public get modal(): CommandObject['modal'] {
        return this.#modal as CommandObject['modal'];
    }
}

export type ApplicationData = {
    name: CommandObject['name'];
    description: CommandObject['description'];
    options: CommandObject['options'];
    default_member_permissions: CommandObject['default_member_permissions'];
};

export type CommandObject = {
    name: string;
    description: string;
    options?: ChatInputApplicationCommandData['options'];
    aliases: Array<string>;
    category: '' | 'config' | 'quotes' | 'roleplay' | 'utility';
    cooldown?: number;
    disabled?: boolean;
    beta?: boolean;
    defered?: boolean;
    default_member_permissions?: string;
    permissions?: Array<PermissionResolvable>;
    prefixCommand?: (message: Message, args: Array<string>) => Promise<unknown>;
    slashCommand?: (interaction: ChatInputCommandInteraction, options: ChatInputCommandInteraction['options']) => Promise<unknown>;
    button?: (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    selectMenu?: (interaction: AnySelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    modal?: (interaction: ModalSubmitInteraction, fields: Collection<string, TextInputComponent>) => Promise<unknown>;
};
