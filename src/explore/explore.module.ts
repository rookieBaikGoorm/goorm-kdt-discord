import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { DiscordCommandModule } from '#/command/discord-command.module';
import { DiscordModule } from '#/discord/discord.module';

import { ExploreService } from './explore.service';

@Module({
	imports: [DiscoveryModule, DiscordModule, DiscordCommandModule],
	providers: [ExploreService],
})
export class ExploreModule {}
