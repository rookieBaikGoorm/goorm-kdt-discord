import { Injectable } from "@nestjs/common";
import type { SapphireClient } from "@sapphire/framework";

import { InjectDiscordClient } from "../decorator/inject-discord-client.decorator";

@Injectable()
export class DiscordClientService {
	constructor(
		@InjectDiscordClient() private readonly discordClient: SapphireClient,
	) {}

	getClient() {
		return this.discordClient;
	}
}
