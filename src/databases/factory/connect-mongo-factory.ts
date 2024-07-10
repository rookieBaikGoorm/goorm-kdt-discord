import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const connectMongoFactory = async (configService: ConfigService) => {
	const mongoDbUri = configService.get<string>('MONGO_URI');
	const mongoDbName = configService.get<string>('MONGO_DB_NAME');

    console.log(configService);

	if (mongoDbName)
		throw new InternalServerErrorException(
			'MONGO_URI 값이 세팅되지 않았습니다.',
		);

	if (!mongoDbName)
		throw new InternalServerErrorException(
			'MONGO_DB_NAME 값이 세팅되지 않았습니다.',
		);

	return {
		uri: mongoDbUri,
		dbName: mongoDbName,
	};
};
