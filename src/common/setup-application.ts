import { type INestApplication, ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import type { Application } from 'express';

import { ValidationException } from '#exceptions/validation-exception';

export const setupApplication = async (app: INestApplication) => {
	app.use(cookieParser());
	app.enableCors({ origin: true, credentials: true });

	/**
	 * API Validation Pipeline
	 */
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			exceptionFactory: (errors) => new ValidationException(errors),
		}),
	);

	/**
	 * Disable non-security Header
	 */
	const expressApp: Application = app.getHttpAdapter().getInstance();
	expressApp.disable('x-powered-by');
	expressApp.disable('Server');
};
