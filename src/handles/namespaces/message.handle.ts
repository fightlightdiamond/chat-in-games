import {Namespace, Server, Socket} from 'socket.io';
import {GET_NAMESPACES, SEND_MESSAGE} from "../../constants";
import {namespaces} from "../../seeder";
import {IRoomMessage} from "../../interfaces";

/**
 * Message Handle
 * @param io
 * @param socket
 * @param thisNamespace
 */
export const messageHandle = (io: Server, socket: Socket, thisNamespace: Namespace) => {
    socket.on(GET_NAMESPACES, () => {
        socket.emit(GET_NAMESPACES, namespaces)
    })

    thisNamespace.on(SEND_MESSAGE,  (roomMessage: IRoomMessage) => {
        thisNamespace.in(roomMessage.roomName).emit(SEND_MESSAGE, roomMessage.message);
    })
}
