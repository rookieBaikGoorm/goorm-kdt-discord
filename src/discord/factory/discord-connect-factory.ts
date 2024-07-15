import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Client, GatewayIntentBits } from 'discord.js';

import { RequireVariableException } from '#/common/exceptions/require-variable-exception';

export const discordConnectionFactory = async (
	configService: ConfigService,
) => {
	const DISCORD_TOKEN = configService.get<string>('DISCORD_TOKEN');

	if (!DISCORD_TOKEN) {
		throw new RequireVariableException('DISCORD_TOKEN');
	}

	try {
		const client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildScheduledEvents,
				GatewayIntentBits.GuildMessages,
			],
		});
		await client.login(DISCORD_TOKEN);
		return client;
	} catch (error) {
		throw new InternalServerErrorException(
			error,
			'Discord Client 세팅 과정에서 에러가 발생했습니다.',
		);
	}
};
