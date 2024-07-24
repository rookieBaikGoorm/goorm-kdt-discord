import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { DATABASE_CONNECTION } from '#/databases/constants/connection';
import {
	ScheduledMessage,
	ScheduledMessageDocument,
} from '#/databases/schema/scheduled-message.schema';

@Injectable()
export class ScheduledMessageRepository {
	constructor(
		@InjectModel('ScheduledMessage', DATABASE_CONNECTION.KDT_DISCORD)
		private readonly scheduledMessageModel: Model<ScheduledMessageDocument>,
	) {}

	getAllMessage() {
		return this.scheduledMessageModel.find({}).lean();
	}

	createMessage(initialCreatedMessage: Partial<ScheduledMessage>) {
		return this.scheduledMessageModel.create(initialCreatedMessage);
	}

	deleteMessage(objectId: string) {
		return this.scheduledMessageModel
			.deleteOne({ _id: Types.ObjectId.createFromHexString(objectId) })
			.exec();
	}
}
