import { Injectable } from '@nestjs/common';

import { Client, REST as DiscordRestClient } from 'discord.js';

import { InjectDiscordClient } from './decorators/inject-discord-client';
import { InjectDiscordRestClient } from './decorators/inject-discord-rest-client';

@Injectable()
export class DiscordClientService {
	constructor(
		@InjectDiscordClient() private readonly discordClient: Client,
		@InjectDiscordRestClient()
		private readonly discordRestClient: DiscordRestClient,
	) {}

	getClient() {
		return this.discordClient;
	}

	getRestClient() {
		return this.discordRestClient;
	}
}
