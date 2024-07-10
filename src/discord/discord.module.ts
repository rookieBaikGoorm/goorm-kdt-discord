import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { discordConnectionFactory } from './factory/discord-connect-factory';

export const DISCORD_CLIENT = Symbol('DISCORD_CLIENT');

@Global()
@Module({
	controllers: [DiscordController],
	providers: [DiscordService],
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
			],
			exports: [DISCORD_CLIENT],
		};
	}
}
