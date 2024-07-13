import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { connectMongoFactory } from './factory/connect-mongo-factory';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: 'kdt-discord',
      imports: [ConfigModule],
      useFactory: connectMongoFactory,
      inject: [ConfigService],
    }),
  ]
})
export class DatabasesModule {}
