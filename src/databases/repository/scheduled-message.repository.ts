import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { DATABASE_CONNECTION } from '#/databases/constants/connection';
import { ScheduledMessage } from '#/databases/schema/scheduled-message.schema';

@Injectable()
export class ScheduledMessageRepository {
	constructor(
		@InjectModel('ScheduledMessage', DATABASE_CONNECTION.KDT_DISCORD)
		private readonly scheduledMessageModel: Model<ScheduledMessage>,
	) {}

	getAllMessage() {
		return this.scheduledMessageModel.find({});
	}

	createMessage(scheduledMessage: ScheduledMessage) {
		return this.scheduledMessageModel.create(scheduledMessage);
	}
}
