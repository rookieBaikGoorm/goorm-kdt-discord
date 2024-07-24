import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { CronJob } from 'cron';
import { ChannelType } from 'discord.js';

import { ScheduledMessageRepository } from '#/databases/repository/scheduled-message.repository';
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
			this.registerScheduleMessage(
				scheduledMessage._id.toString(),
				scheduledMessage.channelId,
				scheduledMessage.cronJob,
				scheduledMessage.message,
			);
		});
	}

	private async registerScheduleMessage(
		id: string,
		channelId: string,
		cronJob: string,
		message: string,
	) {
		const discordClient = this.discordClientService.getClient();
        const job = new CronJob(cronJob, () => {
            const channel = discordClient.channels.cache.get(channelId);
            if (channel.type === ChannelType.GuildText) channel.send(message);
        });
        this.schedulerRegistry.addCronJob(id, job);
	}
}
