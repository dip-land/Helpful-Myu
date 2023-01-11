import type {
    ButtonInteraction,
    CacheType,
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOption,
    Message,
    PermissionResolvable,
    AnySelectMenuInteraction,
} from 'discord.js';

export class Command {
    #name = '';
    #description = '';
    #options?: ChatInputApplicationCommandData['options'] = [];
    #aliases: Array<string> = [];
    #category: CommandCategories = '';
    #cooldown?: number = 5;
    #disabled?: boolean = false;
    #default_member_permissions?: string;
    #permissions?: Array<PermissionResolvable> = [];
    #prefixCommand?: (message: Message, args: Array<string>) => Promise<unknown>;
    #slashCommand?: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<unknown>;
    #button?: (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    #selectMenu?: (interaction: AnySelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    constructor(options: CommandOptions) {
        this.#name = options.name;
        this.#description = options.description;
        this.#options = options.options;
        this.#aliases = options.aliases;
        this.#category = options.category;
        this.#cooldown = options.cooldown;
        this.#disabled = options.disabled;
        this.#default_member_permissions = options.default_member_permissions;
        this.#permissions = options.permissions;
        this.#prefixCommand = options.prefixCommand;
        this.#slashCommand = options.slashCommand;
        this.#button = options.button;
        this.#selectMenu = options.selectMenu;
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
            permissions: this.#permissions,
            prefixCommand: this.#prefixCommand,
            slashCommand: this.#slashCommand,
            button: this.#button,
            selectMenu: this.#selectMenu,
        };
    }

    public get prefixCommand(): (message: Message, args: Array<string>) => Promise<unknown> {
        return this.#prefixCommand as (message: Message<boolean>, args: string[]) => Promise<unknown>;
    }
    public get slashCommand(): (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<unknown> {
        return this.#slashCommand as (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<unknown>;
    }
    public get button(): (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown> {
        return this.#button as (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    }
    public get selectMenu(): (interaction: AnySelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown> {
        return this.#selectMenu as (interaction: AnySelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    }
}

export type CommandCategories = '' | 'config' | 'music' | 'quotes' | 'utility';

export type CommandOptions = {
    name: string;
    description: string;
    options?: ChatInputApplicationCommandData['options'];
    aliases: Array<string>;
    category: CommandCategories;
    cooldown?: number;
    disabled?: boolean;
    default_member_permissions?: string;
    permissions?: Array<PermissionResolvable>;
    prefixCommand?: (message: Message, args: Array<string>) => Promise<unknown>;
    slashCommand?: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<unknown>;
    button?: (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    selectMenu?: (interaction: AnySelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
};

export type ApplicationData = {
    name: string;
    description: string;
    options: ChatInputApplicationCommandData['options'];
    default_member_permissions: string | undefined;
};

export type CommandObject = {
    name: string;
    description: string;
    options: ChatInputApplicationCommandData['options'];
    aliases: Array<string>;
    category: CommandCategories;
    cooldown?: number;
    disabled?: boolean;
    default_member_permissions?: string;
    permissions?: Array<PermissionResolvable>;
    prefixCommand?: (message: Message, args: Array<string>) => Promise<unknown>;
    slashCommand?: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<unknown>;
    button?: (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
    selectMenu?: (interaction: AnySelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<unknown>;
};
