import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Client, GatewayIntentBits } from 'discord.js';

export const discordConnectionFactory = async (
	configService: ConfigService,
) => {
	const DISCORD_TOKEN = configService.get<string>('DISCORD_TOKEN');

	if (!DISCORD_TOKEN) {
		throw new InternalServerErrorException(
			'DISCORD_TOKEN 이 세팅되지 않았습니다.',
		);
	}

	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.GuildScheduledEvents,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessagePolls,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMessageTyping,
		],
	});

	await client.login(DISCORD_TOKEN);

	return client;
};
