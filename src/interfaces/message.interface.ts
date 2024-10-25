export enum messageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
}

export interface IMessage {
    id: number;
    senderId: number;
    message: string;
    type: messageType
    timestamp: Date;
}

export interface IRoomMessage extends IMessage {
    roomId: number;
    roomName: string;
}

export interface IPrivateMessage extends IMessage {
    recipientId: number;
    isRead?: boolean;
}

export interface IMessageEntity extends IMessage {
    id: number;
    senderId: number;
    senderName: string;
    message: string;
    timestamp: Date;
    isPrivate?: boolean;
    roomId?: number;
    roomName?: string;
    recipientId?: number | null;
}

export interface LoadMessagesResponse {
    messages: IMessage[];
    hasMore: boolean;
}

export const SEND_PRIVATE_MESSAGE = 'SEND_PRIVATE_MESSAGE';
export const SEND_ROOM_MESSAGE = 'SEND_PRIVATE_MESSAGE';

