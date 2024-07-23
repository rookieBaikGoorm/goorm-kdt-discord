import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { connectMongoFactory } from './factory/connect-mongo-factory';
import { ScheduledMessageSchema } from './schema/scheduled-message.schema';

@Global()
@Module({
	imports: [
		MongooseModule.forRootAsync({
			connectionName: 'kdt-discord',
			imports: [ConfigModule],
			useFactory: connectMongoFactory,
			inject: [ConfigService],
		}),
		MongooseModule.forFeature([
			{ name: 'ScheduledMessage', schema: ScheduledMessageSchema },
		]),
	],
})
export class DatabasesModule {}
