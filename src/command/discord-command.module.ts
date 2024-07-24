import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { DiscordModule } from '#/discord/discord.module';
import { RegisterScheduleModule } from '#/schedule/schedule.module';

import { DatabasesModule } from '../databases/databases.module';

import { DiscordCommandExplorerService } from './command-explorer.service';
import { DiscordCommandService } from './discord-command.service';
import { ScheduleCommand } from './slash-commands/schedule.command';

@Global()
@Module({
	imports: [
		DatabasesModule,
		DiscordModule,
		DiscoveryModule,
		RegisterScheduleModule,
	],
	providers: [
		DiscordCommandService,
		DiscordCommandExplorerService,
		ScheduleCommand,
	],
	exports: [DiscordCommandService, DiscordCommandExplorerService],
})
export class DiscordCommandModule {}
