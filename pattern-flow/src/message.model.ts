import { Schema, model } from 'mongoose';
import { IMessage } from './eip.interface'

// Create a schema for HL7 messages
const messageSchema = new Schema<IMessage>({
    header: Object,
    content:  String,
    timestamp: { type: Date, default: Date.now },
});

const Message = model<IMessage>('Message', messageSchema);

export default Message




