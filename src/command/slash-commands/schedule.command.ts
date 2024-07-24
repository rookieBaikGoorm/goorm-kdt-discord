import { SlashCommandBuilder } from '@discordjs/builders';
import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	TextChannel,
} from 'discord.js';
import { Client } from 'discord.js';

import { Command } from '#/command/decorators/discord-command';
import { SlashCommand } from '#/common/types/discord-command';
import { ScheduledMessageRepository } from '#/databases/repository/scheduled-message.repository';
import { generateRegisteredScheduleMessageEmbed, generateSuccessScheduleMessageEmbed } from '#/messages/embed/schedule-message';
import { RegisterScheduleService } from '#/schedule/schedule.service';

import { CommandHandler } from '../decorators/discord-command-handler';

@Command()
export class ScheduleCommand implements SlashCommand {
	constructor(
		private readonly registerScheduleService: RegisterScheduleService,
		private readonly scheduledRepository: ScheduledMessageRepository,
	) {}

	public builder = new SlashCommandBuilder()
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
						.setName('day-of-week')
						.setDescription(
							'예약 메세지를 출력할 요일을 설정합니다.',
						)
						.addChoices(
							{ name: '월요일', value: '1' },
							{ name: '화요일', value: '2' },
							{ name: '수요일', value: '3' },
							{ name: '목요일', value: '4' },
							{ name: '금요일', value: '5' },
							{ name: '토요일', value: '6' },
							{ name: '일요일', value: '0' },
						)
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setName('hour')
						.setDescription(
							'예약 메세지를 출력할 시간을 설정합니다. (0 ~ 23)',
						)
						.setMinValue(0)
						.setMaxValue(23)
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setName('minute')
						.setDescription(
							'예약 메세지를 출력할 분을 설정합니다. (0 ~ 59)',
						)
						.setMinValue(0)
						.setMaxValue(59)
						.setRequired(true),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName('delete')
				.setDescription('등록한 예약 메세지를 삭제합니다.')
				.addStringOption((option) =>
					option
						.setName('id')
						.setDescription(
							'삭제하고자 하는 예약 메세지 ID 를 입력해주세요.',
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName('list')
				.setDescription('등록한 예약 메세지를 열람합니다.')
		);

	private async createSchedule(interaction: ChatInputCommandInteraction) {
		const message = interaction.options.getString('message');
		const channel: TextChannel = interaction.options.getChannel('channel');
		const hour = interaction.options.getString('hour');
		const minute = interaction.options.getString('minute');
		const registeredUser = interaction.user;

		await interaction.reply({
			content: '메세지를 등록하는 중입니다...',
			ephemeral: true,
		});

		await this.scheduledRepository.createMessage({
			message,
			channelId: channel.id,
			cronJob: `${minute} ${hour} * * ${1}`,
			registeredUserId: registeredUser.id,
		});

		const embed = generateSuccessScheduleMessageEmbed(
			message,
			registeredUser.displayName,
			channel.name,
		);

		await interaction.editReply({
			embeds: [embed],
			content: '',
		});
	}

	private async deleteSchedule(interaction: ChatInputCommandInteraction) {
		const jobId = interaction.options.getString('id');
		await this.registerScheduleService.deleteScheduleMessage(jobId);
		await this.scheduledRepository.deleteMessage(jobId);
	}

	private async listSchedule(interaction: ChatInputCommandInteraction) {
		const scheduledMessageList =
			await this.scheduledRepository.getAllMessage();
		const embed = generateRegisteredScheduleMessageEmbed(scheduledMessageList);

		await interaction.reply({
			embeds: [embed],
			content: '',
		});
	
	}

	@CommandHandler()
	async handler(_: Client, interaction: ChatInputCommandInteraction) {
		const subCommand = interaction.options.getSubcommand();
		switch (subCommand) {
			case 'set': {
				await this.createSchedule(interaction);
				break;
			}

			case 'delete': {
				await this.deleteSchedule(interaction);
				break;
			}

			case 'list': {
				await this.listSchedule(interaction);
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

	private create;
}
