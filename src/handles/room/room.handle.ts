import { Server, Socket } from 'socket.io';

interface IJoinRoom {
    name: string
}

export const roomHandle = (io: Server, socket: Socket) => {
    socket.on("join", (dataFormClient: IJoinRoom) => {
        socket.join(dataFormClient.name);
        // socket.emit("joinedRoom", true)
        io.to(socket.id).emit('joinedRoom', 'I just met you');
    })
}
