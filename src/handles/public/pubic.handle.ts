import {Namespace, Server, Socket} from 'socket.io';
import {SEND_MESSAGE, UPLOAD} from "../../constants";
import {IMessage,} from "../../interfaces";
import {uploadFile} from "../../services/upload.service";

/**
 *
 * @param io
 * @param socket
 * @param thisNamespace
 */
export const pubicHandle = (io: Server, socket: Socket, thisNamespace: Namespace) => {
    socket.on(SEND_MESSAGE,  (msg: IMessage) => {
        console.log('Handle by socket')
        socket.broadcast.emit(SEND_MESSAGE, msg)
    })

    socket.on(UPLOAD, async (file: Buffer, callback: (response: { message: string }) => void) => {
        console.log(file); // <Buffer 25 50 44 ...>

        await uploadFile(file);

        callback({ message: 'success' });
    });
}

export const shareFile = (socket: Socket, msg: IMessage) => {
    socket.broadcast.emit(SEND_MESSAGE, msg)
}
