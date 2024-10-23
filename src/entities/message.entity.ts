import {IMessageEntity, messageType} from "../interfaces";

export class MessageEntity implements IMessageEntity {
    id!: number;
    senderId!: number;
    senderName!: string;
    message!: string;
    timestamp!: Date;
    isPrivate?: boolean;
    roomId?: number;
    roomName?: string;
    recipientId?: number | null;
    type!: messageType;

    protected table = 'messages';

    constructor(data: Partial<MessageEntity>) {
        this.setDefaultData(data)
        Object.assign(this, data);
    }

    setDefaultData(data: Partial<MessageEntity>) {
        this.type = data.type || messageType.TEXT;
    }
}