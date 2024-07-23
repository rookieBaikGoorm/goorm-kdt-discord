import { Global, Module } from '@nestjs/common';

import { DiscordModule } from '#/discord/discord.module';

import { DiscordCommandService } from './discord-command.service';
import { ScheduleCommand } from './slash-commands/schedule.command';

@Global()
@Module({
	imports: [DiscordModule],
	providers: [DiscordCommandService, ScheduleCommand],
})
export class DiscordCommandModule {}
