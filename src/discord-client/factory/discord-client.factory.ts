import { InternalServerErrorException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";

import { RequireVariableException } from "#/exception/require-variable.exception";


export const discordConnectionFactory = async (
	configService: ConfigService,
) => {
	const DISCORD_TOKEN = configService.get<string>("DISCORD_TOKEN");

	if (!DISCORD_TOKEN) {
		throw new RequireVariableException("DISCORD_TOKEN");
	}

	try {
		const client = new SapphireClient({
			intents: [
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
			],
			loadMessageCommandListeners: true,
		});
		await client.login(DISCORD_TOKEN);
		return client;
	} catch (error) {
		throw new InternalServerErrorException(
			error,
			"Discord Client 세팅 과정에서 에러가 발생했습니다.",
		);
	}
};
