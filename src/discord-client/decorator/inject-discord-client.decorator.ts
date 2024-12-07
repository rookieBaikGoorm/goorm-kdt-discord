import { Inject } from '@nestjs/common';

import { DISCORD_CLIENT } from '../constant/discord-client.constant';

export function InjectDiscordClient(): ParameterDecorator {
	return Inject(DISCORD_CLIENT);
}
