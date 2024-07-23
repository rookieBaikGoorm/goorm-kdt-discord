import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class ScheduledMessage {
    @Prop({ type: String })
    registeredUserId: string;
    
    @Prop({ type: String })
    cronJob: string;

    @Prop({ type: String })
    channelId: string;
}

export const ScheduledMessageSchema = SchemaFactory.createForClass(ScheduledMessage);