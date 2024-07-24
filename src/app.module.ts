import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DiscordCommandModule } from '#/command/discord-command.module';
import { DatabasesModule } from '#/databases/databases.module';
import { DiscordModule } from '#/discord/discord.module';
import { ExploreModule } from '#/explore/explore.module';
import { RegisterScheduleModule } from '#/schedule/schedule.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./src/common/configs/.env.${process.env.NODE_ENV}`,
		}),
		DatabasesModule,
		DiscordModule.forRootAsync(),
		DiscordCommandModule,
		ExploreModule,
		ScheduleModule.forRoot(),
		RegisterScheduleModule,
	],
	providers: [Logger],
})
export class AppModule {}
