import {Namespace, Server, Socket} from 'socket.io';
import {JOIN_ROOM, SEND_MESSAGE} from "../../constants";
import {IRoomMessage} from "../../interfaces";
import {messages} from "../../seeder";

/**
 *
 * @param io
 * @param socket
 * @param thisNamespace
 */
export const roomHandle = (io: Server, socket: Socket, thisNamespace: Namespace) => {
    socket.on(JOIN_ROOM, async (roomName: string, ackCallBack) => {
        // const rooms = socket.rooms;
        // leave old room when join new room
        // rooms.forEach((room) => {
        //     socket.leave(room)
        // })

        socket.join(roomName);

        ackCallBack({
            histories: messages
        })
    })

    socket.on(SEND_MESSAGE,  (roomMessage: IRoomMessage) => {
        thisNamespace.to(roomMessage.roomName).emit(SEND_MESSAGE, roomMessage)
    })
}
