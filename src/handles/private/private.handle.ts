import {Server, Socket} from 'socket.io';
import {SEND_PRIVATE_MESSAGE} from "../../constants";
import {IPrivateMessage} from "../../interfaces";

/**
 * Private Handle
 *
 * @param io
 * @param socket
 */
export const privateHandle = (io: Server, socket: Socket) => {
    socket.on(SEND_PRIVATE_MESSAGE,  (msg: IPrivateMessage) => {
        const { recipientId, message} = msg;
        io.to(recipientId.toString()).emit(SEND_PRIVATE_MESSAGE, msg);
    });
}