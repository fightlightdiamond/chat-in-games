import { Server, Socket } from 'socket.io';

export const slackHandle = (io: Server, socket: Socket) => {
    socket.on("newMessageToSever", (dataFormClient) => {
        console.log("data", dataFormClient)
        io.emit("newMessageToClients", {text: dataFormClient.text})
    })
}
