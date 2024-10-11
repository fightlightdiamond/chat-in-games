export interface IMessage {
    id: number;
    content: string;
    room: number;
    createBy: number;
    createdAt: string;
}

export interface IMessageRoom  extends  IMessage {
    roomId: number;
}