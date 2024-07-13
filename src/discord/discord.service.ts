import { Injectable } from '@nestjs/common';

import { Client, REST as DiscordRestClient, Routes } from 'discord.js';

import { DiscordCommandService } from './commands/discord-command.service';
import { InjectDiscordClient } from './decorators/inject-discord-client';
import { InjectDiscordRestClient } from './decorators/inject-discord-rest-client';

@Injectable()
export class DiscordService {
	private APPLICATION_ID: '1260108134828081174';
	private GUILD_ID = '1260871187941163030';

	constructor(
		@InjectDiscordClient() private readonly discordClient: Client,
		@InjectDiscordRestClient()
		private readonly discordRestClient: DiscordRestClient,
		private readonly discordCommandService: DiscordCommandService,
	) {
		this.registerGuildCommand();
	}

	private async registerGuildCommand() {
		const registeredSlashCommands =
			this.discordCommandService.getRegisteredSlashCommands();
		await this.discordRestClient.put(
			Routes.applicationGuildCommands(
				'1260108134828081174',
				this.GUILD_ID,
			),
			{ body: registeredSlashCommands },
		);
	}
}
