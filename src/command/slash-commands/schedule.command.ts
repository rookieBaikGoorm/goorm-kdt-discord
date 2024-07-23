import { SlashCommandBuilder } from '@discordjs/builders';
import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	TextChannel,
} from 'discord.js';
import { Client } from 'discord.js';

import { Command } from '#/command/decorators/discord-command';
import type { SlashCommand } from '#/common/types/discord-command';
import { ScheduledMessageRepository } from '#/databases/repository/scheduled-message.repository';
import { generateSuccessScheduleMessageEmbed } from '#/messages/embed/schedule-message';

@Command()
export class ScheduleCommand implements SlashCommand {
	constructor(
		private readonly scheduledRepository: ScheduledMessageRepository,
	) {}

	builder = new SlashCommandBuilder()
		.setName('schedule')
		.setDescription(
			'정해진 시간에 특정 채널에 예약 메세지를 실행하도록 합니다.',
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subCommand) =>
			subCommand
				.setName('set')
				.setDescription('새로운 예약 메세지를 등록합니다.')
				.addStringOption((option) =>
					option
						.setName('message')
						.setDescription(
							'메세지는 최소 3글자 이상이어야 합니다.',
						)
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription(
							'예약 메세지를 출력할 채널을 선택합니다.',
						)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('cron_job')
						.setDescription(
							'예약 메세지를 출력할 시간대를 설정합니다.',
						)
						.addChoices(
							{ name: 'EVERY_DAY_AT_1AM', value: '0 01 * * *' },
							{
								name: 'EVERY_DAY_AT_MIDNIGHT',
								value: '0 0 * * *',
							},
							{ name: 'EVERY_WEEKDAY', value: '0 0 * * 1-5' },
						)
						.setRequired(true),
				),
		);
	async handler(client: Client, interaction: ChatInputCommandInteraction) {
		const subCommand = interaction.options.getSubcommand();
		switch (subCommand) {
			case 'set': {
				const message = interaction.options.getString('message');
				const channel: TextChannel =
					interaction.options.getChannel('channel');
				const cronJob = interaction.options.getString('cron_job');
				const registeredUser = interaction.user;

				await interaction.reply({
					content: '메세지를 등록하는 중입니다...',
					ephemeral: true,
				});

				await this.scheduledRepository.createMessage({
					message,
					channelId: channel.id,
					cronJob,
					registeredUserId: registeredUser.id,
				});

				const embed = generateSuccessScheduleMessageEmbed(
					message,
					registeredUser.displayName,
				);

				await interaction.editReply({
					embeds: [embed],
					
				});
				break;
			}

			default: {
				await interaction.reply({
					content: '유효하지 않은 명령어입니다.',
					ephemeral: true,
				});
			}
		}
	}
}
