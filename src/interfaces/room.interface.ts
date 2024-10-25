export interface IRoom {
    id: number;
    name: string; // unique
    code: string; // unique
    namespaceId: number;
}

export interface IUserRoom {
    userId: number;
    roomId: number;
}
// // first send message
// export interface IPrivateRoom {
//     id: number; //prefix private,
//     initiatorId: number;
//     recipientId: number;
//     isFriend: boolean;
//     createAt: string;
// }

/**
 * After user login, check new message in room, then load history messages and show status new message
 * Used had view message change isNewMessage to false
 * Another user send message, change status broadcast UserRom to isNewMessage false, and emit sendMessage
 */
export interface IUserRoom {
    userId: number;
    roomId: number;
    isNewMessage: number;
    lastReadAt: Date;
}

// export interface IPrivateUserRoom {
//     userId: number;
//     roomId: number;
//     isNewMessage: number;
//     lastReadAt: Date;
// }

// check ban list before Join room
export interface IBanUser {
    id: number;
    initiatorId: number;
    recipientId: number;
    reason?: string;
    createAt: string;
}