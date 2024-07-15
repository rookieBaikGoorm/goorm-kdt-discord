import { Inject } from '@nestjs/common';

import { DISCORD_REST_CLIENT } from '../constants/index';

export function InjectDiscordRestClient(): ParameterDecorator {
	return Inject(DISCORD_REST_CLIENT);
}
