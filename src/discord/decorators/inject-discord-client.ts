import { Inject } from '@nestjs/common';

import { DISCORD_CLIENT } from '../constants/index';

export function InjectDiscordClient(): ParameterDecorator {
	return Inject(DISCORD_CLIENT);
}
