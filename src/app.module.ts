import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DiscordCommandModule } from '#/command/discord-command.module';
import { DatabasesModule } from '#/databases/databases.module';
import { DiscordModule } from '#/discord/discord.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./src/common/configs/.env.${process.env.NODE_ENV}`,
		}),
		DatabasesModule,
		DiscordModule.forRootAsync(),
		DiscordCommandModule,
		ScheduleModule.forRoot(),
		// DatabasesModule,
	],
	providers: [Logger],
})
export class AppModule {}
