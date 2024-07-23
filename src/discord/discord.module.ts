import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

import { DatabasesModule } from '#/databases/databases.module';

import { DISCORD_CLIENT, DISCORD_REST_CLIENT } from './constants';
import { DiscordClientService } from './discord.service';
import { discordConnectionFactory } from './factory/discord-connect-factory';
import { discordRestConnectionFactory } from './factory/discord-rest-factory';

@Global()
@Module({
	imports: [DiscoveryModule, DatabasesModule],
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
				DiscordClientService,
			],
			exports: [
				DISCORD_CLIENT,
				DISCORD_REST_CLIENT,
				DiscordClientService,
			],
		};
	}
}
