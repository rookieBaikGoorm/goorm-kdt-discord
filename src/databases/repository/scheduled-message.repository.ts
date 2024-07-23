import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ScheduledMessage } from '../schema/scheduled-message.schema';

@Injectable()
export class ScheduledMessageRepository {
	constructor(
		@InjectModel('ScheduledMessage')
		private readonly scheduledMessageModel: Model<ScheduledMessage>,
	) {}

    getAllMessage() {
        return this.scheduledMessageModel.find({});
    }

    createMessage(scheduledMessage: ScheduledMessage) {
        return this.scheduledMessageModel.create(scheduledMessage);
    }
}
