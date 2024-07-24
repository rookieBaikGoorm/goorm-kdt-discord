import { Module } from '@nestjs/common';

import { DatabasesModule } from '#/databases/databases.module';
import { DiscordModule } from '#/discord/discord.module';

import { RegisterScheduleService } from './schedule.service';

@Module({
	imports: [DatabasesModule, DiscordModule],
	providers: [RegisterScheduleService],
	exports: [RegisterScheduleService],
})
export class RegisterScheduleModule {}
