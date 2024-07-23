import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DATABASE_CONNECTION } from './constants/connection';
import { connectMongoFactory } from './factory/connect-mongo-factory';
import { ScheduledMessageRepository } from './repository/scheduled-message.repository';
import { ScheduledMessageSchema } from './schema/scheduled-message.schema';

@Global()
@Module({
	imports: [
		MongooseModule.forRootAsync({
			connectionName: DATABASE_CONNECTION.KDT_DISCORD,
			imports: [ConfigModule],
			useFactory: connectMongoFactory,
			inject: [ConfigService],
		}),
		MongooseModule.forFeature(
			[{ name: 'ScheduledMessage', schema: ScheduledMessageSchema }],
			DATABASE_CONNECTION.KDT_DISCORD,
		),
	],
	providers: [ScheduledMessageRepository],
	exports: [ScheduledMessageRepository],
})
export class DatabasesModule {}
