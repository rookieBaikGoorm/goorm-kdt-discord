import { DynamicModule, Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DiscordCommandService } from './commands/discord-command.service';
import { DISCORD_CLIENT, DISCORD_REST_CLIENT } from './constants';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { discordConnectionFactory } from './factory/discord-connect-factory';
import { discordRestConnectionFactory } from './factory/discord-rest-factory';

@Global()
@Module({
	controllers: [DiscordController],
	providers: [DiscordService, DiscordCommandService],
})
export class DiscordModule {
	static forRootAsync(): DynamicModule {
		return {
			module: DiscordModule,
			imports: [ConfigModule],
			providers: [
				{
					provide: DISCORD_CLIENT,
					inject: [ConfigService],
					useFactory: discordConnectionFactory,
				},
				{
					provide: DISCORD_REST_CLIENT,
					inject: [ConfigService],
					useFactory: discordRestConnectionFactory,
				},
			],
			exports: [DISCORD_CLIENT],
		};
	}


}
