import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type ClientEvents, Routes } from 'discord.js';

import { SlashCommand } from '#/common/types/discord-command';
import { DiscordClientService } from '#/discord/discord.service';

import { ScheduleCommand } from './slash-commands/schedule.command';

@Injectable()
export class DiscordCommandService implements OnApplicationBootstrap {
	private GUILD_ID: string;
	private APPLICATION_ID: string;

	constructor(
		private readonly discordClientService: DiscordClientService,
		private readonly configService: ConfigService,
		private scheduledCommand: ScheduleCommand,
	) {
		this.GUILD_ID = this.configService.get<string>('GUILD_ID');
		this.APPLICATION_ID = this.configService.get<string>('APPLICATION_ID');
	}

	private readonly event: keyof ClientEvents = 'interactionCreate';

	async onApplicationBootstrap() {
		await this.registerGuildCommand();
	}

	// TODO : ExplorerService 로 Command 를 찾도록 수정 필요
	private commandList = [this.scheduledCommand];

	private async registerGuildCommand() {
		const registeredCommandJson = this.commandList.map((command) => {
			this.addListenerToCommand(command);
			return command.builder.toJSON();
		});

		const discordRestClient = this.discordClientService.getRestClient();
		await discordRestClient.put(
			Routes.applicationGuildCommands(this.APPLICATION_ID, this.GUILD_ID),
			{ body: registeredCommandJson },
		);
	}

	private async addListenerToCommand(command: SlashCommand) {
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
					await command.handler(discordClient, interaction);
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
