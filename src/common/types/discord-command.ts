import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
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
	command: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	execute: (client: Client, interaction: ChatInputCommandInteraction) => void;
	autocomplete?: (interaction: AutocompleteInteraction) => void;
	modal?: (interaction: ModalSubmitInteraction<CacheType>) => void;
	cooldown?: number;
}

export interface Command {
	name: string;
	execute: (client: Client, message: Message, args: Array<string>) => void;
	permissions: Array<PermissionResolvable>;
	aliases: Array<string>;
	cooldown?: number;
}
