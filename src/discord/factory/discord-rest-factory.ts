import { RequireVariableException } from '#/common/exceptions/require-variable-exception';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { REST as DiscordRestClient } from 'discord.js';

export const discordRestConnectionFactory = async (
	configService: ConfigService,
) => {
	const DISCORD_TOKEN = configService.get<string>('DISCORD_TOKEN');

	if (!DISCORD_TOKEN) {
		throw new RequireVariableException('DISCORD_TOKEN');
	}

	try {
		const restClient = new DiscordRestClient().setToken(DISCORD_TOKEN);
		return restClient;
	} catch (error) {
		throw new InternalServerErrorException(
			error,
			'Discord Client 세팅 과정에서 에러가 발생했습니다.',
		);
	}
};
