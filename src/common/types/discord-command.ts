import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import {
	AutocompleteInteraction,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	Message,
	ModalSubmitInteraction,
	PermissionResolvable,
} from 'discord.js';

export interface SlashCommand {
	builder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	handler: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>;
	autocomplete?: (interaction: AutocompleteInteraction) => void;
	modal?: (interaction: ModalSubmitInteraction<CacheType>) => void;
	cooldown?: number;
}

export interface Command {
	name: string;
	handler: (client: Client, message: Message, args: Array<string>) => void;
	permissions: Array<PermissionResolvable>;
	aliases: Array<string>;
	cooldown?: number;
}
