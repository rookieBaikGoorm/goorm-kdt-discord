import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DiscordModule } from '#/discord/discord.module';

import { DatabasesModule } from './databases/databases.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./src/common/configs/.env.${process.env.NODE_ENV}`,
		}),
		DiscordModule.forRootAsync(),
		ScheduleModule.forRoot(),
		DatabasesModule,
	],
	providers: [Logger],
})
export class AppModule {}
