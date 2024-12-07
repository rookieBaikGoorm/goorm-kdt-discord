import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DiscordClientModule } from '#/discord-client/discord-client.module';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./src/config/.env.${process.env.NODE_ENV}`,
		}),
		ScheduleModule.forRoot(),
		DiscordClientModule.forRoot(),
	]
})
export class AppModule {}
