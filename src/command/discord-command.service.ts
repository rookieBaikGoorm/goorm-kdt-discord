import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
	type ClientEvents,
	type InteractionReplyOptions,
	Routes,
} from 'discord.js';

import { SlashCommand } from '#/common/types/discord-command';
import { DiscordClientService } from '#/discord/discord.service';

@Injectable()
export class DiscordCommandService {
	private GUILD_ID: string;
	private APPLICATION_ID: string;

	constructor(
		private readonly discordClientService: DiscordClientService,
		private readonly configService: ConfigService,
	) {
		this.GUILD_ID = this.configService.get<string>('GUILD_ID');
		this.APPLICATION_ID = this.configService.get<string>('APPLICATION_ID');
	}

	private readonly event: keyof ClientEvents = 'interactionCreate';

	async registerGuildCommand(command: SlashCommand) {
		const discordRestClient = this.discordClientService.getRestClient();
		await discordRestClient.put(
			Routes.applicationGuildCommands(this.APPLICATION_ID, this.GUILD_ID),
			{ body: [command.builder.toJSON()] },
		);
	}

	async addListenerToCommand(
		command: SlashCommand,
		handler: SlashCommand['handler'],
	) {
		const discordClient = this.discordClientService.getClient();
		discordClient.on(
			this.event,
			async (...eventArgs: ClientEvents['interactionCreate']) => {
				const [interaction] = eventArgs;
				if (
					!interaction.isChatInputCommand() ||
					interaction.commandName !== command.builder.name
				)
					return;

				try {
					await handler(discordClient, interaction);
				} catch (error) {
					const isMessageAlreadySend =
						interaction.replied || interaction.deferred;

					const failedMessage: InteractionReplyOptions = {
						content: '명령어 실행 과정에서 에러가 발생했습니다.',
						ephemeral: true,
					};

					isMessageAlreadySend
						? await interaction.editReply(failedMessage)
						: await interaction.reply(failedMessage);
				}
			},
		);
	}
}
