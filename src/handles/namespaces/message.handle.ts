import { Server, Socket } from 'socket.io';
import {namespaces} from "../../constants";

export const messageHandle = (io: Server, socket: Socket) => {
    socket.on("newMessageToSever", (dataFormClient) => {
        console.log("data", dataFormClient)
        io.emit("newMessageToClients", {text: dataFormClient.text})
    })

    socket.emit('welcome', 'Welcome to')
    socket.on('clientConnect', (data) => {
        console.log(socket.id, "has connect")
    })

    socket.emit('nsList', namespaces)
}
