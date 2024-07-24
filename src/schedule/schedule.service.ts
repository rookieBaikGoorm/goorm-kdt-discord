import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { CronJob } from 'cron';
import { ChannelType } from 'discord.js';

import { ScheduledMessageRepository } from '#/databases/repository/scheduled-message.repository';
import { ScheduledMessageDocument } from '#/databases/schema/scheduled-message.schema';
import { DiscordClientService } from '#/discord/discord.service';

@Injectable()
export class RegisterScheduleService implements OnModuleInit {
	constructor(
		private readonly discordClientService: DiscordClientService,
		private readonly scheduledRepository: ScheduledMessageRepository,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {}

	async onModuleInit(): Promise<void> {
		const scheduledMessageList =
			await this.scheduledRepository.getAllMessage();
		scheduledMessageList.forEach((scheduledMessage) => {
			this.registerScheduleMessage(scheduledMessage);
		});
	}

	private async registerScheduleMessage(
		scheduledMessage: ScheduledMessageDocument,
	) {
		const discordClient = this.discordClientService.getClient();
		const cronJobId = scheduledMessage._id.toHexString();
		const job = new CronJob(scheduledMessage.cronJob, () => {
			const channel = discordClient.channels.cache.get(
				scheduledMessage.channelId,
			);
			if (channel.type === ChannelType.GuildText)
				channel.send(scheduledMessage.message);
		});
		this.schedulerRegistry.addCronJob(cronJobId, job);
	}

	async deleteScheduleMessage(id: string) {
		this.schedulerRegistry.deleteCronJob(id);
	}
}
