import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema()
export class ScheduledMessage {
	@Prop({ type: String })
	registeredUserId: string;

	@Prop({ type: String })
	cronJob: string;

	@Prop({ type: String })
	channelId: string;

	@Prop({ type: String })
	message: string;
}

export type ScheduledMessageDocument = HydratedDocument<ScheduledMessage>;
export const ScheduledMessageSchema =
	SchemaFactory.createForClass(ScheduledMessage);
