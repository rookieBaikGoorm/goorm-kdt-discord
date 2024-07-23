import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
	Client,
	type ClientEvents,
	REST as DiscordRestClient,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes,
} from 'discord.js';

import { SlashCommand } from '#/common/types/discord-command';

import { InjectDiscordClient } from '../decorators/inject-discord-client';
import { InjectDiscordRestClient } from '../decorators/inject-discord-rest-client';

import { ScheduleCommand } from './schedule.command';

@Injectable()
export class DiscordCommandService implements OnApplicationBootstrap {
	private GUILD_ID: string;
	private APPLICATION_ID: string;

	constructor(
		@InjectDiscordClient() private readonly discordClient: Client,
		@InjectDiscordRestClient()
		private readonly discordRestClient: DiscordRestClient,
		private readonly configService: ConfigService,

		// TODO : 명령어 등록을 자동화하는 방안을 
	) {
		this.GUILD_ID = this.configService.get<string>('GUILD_ID');
		this.APPLICATION_ID = this.configService.get<string>('APPLICATION_ID');
	}

	private readonly event: keyof ClientEvents = 'interactionCreate';

	async onApplicationBootstrap() {
		await this.registerGuildCommand();
	}

	// TODO : ExplorerService 로 Command 를 찾도록 수정 필요
	private commandList = [new ScheduleCommand()];

	private async registerGuildCommand() {
		const registeredSlashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
			[];

		this.commandList.forEach((command) => {
			registeredSlashCommands.push(command.builder.toJSON());
			this.listenCommand(command);
		});

		await this.discordRestClient.put(
			Routes.applicationGuildCommands(this.APPLICATION_ID, this.GUILD_ID),
			{ body: registeredSlashCommands },
		);
	}

	private async listenCommand(command: SlashCommand) {
		this.discordClient.on(
			this.event,
			async (...eventArgs: ClientEvents['interactionCreate']) => {
				const [interaction] = eventArgs;
				if (
					!interaction.isChatInputCommand() ||
					interaction.commandName !== command.builder.name
				)
					return;

				try {
					await command.handler(this.discordClient, interaction);
				} catch (error) {
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({
							content:
								'명령어 실행 과정에서 에러가 발생했습니다.',
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content:
								'명령어 실행 과정에서 에러가 발생했습니다.',
							ephemeral: true,
						});
					}
				}
			},
		);
	}
}
