import {Server, Socket} from "socket.io";
import { messageHandle} from "../handles";
import {roomHandle} from "../handles";
import {namespaces} from "../seeder";
import {pubicHandle} from "../handles/public/pubic.handle";

export const registerHandler = (io: Server) => {
    const defaultNamespace = io.of('/');
    // authMiddleware(io);
    const adminNamespace = io.of("/admin");

    /**
     * Default namespace
     */
    defaultNamespace.on("connection", (socket: Socket) => {
        pubicHandle(io, socket, defaultNamespace);

        socket.on('disconnect', (reason) => {
            console.log(`User with ID: ${socket.id} disconnected. Reason: ${reason}`);
        });
    });

    defaultNamespace.on("disconnection", (socket: Socket) => {
        console.log(`Socket disconnection`, socket.id);
    });

    /**
     * Admin namespace
     */
    adminNamespace.on("connection", (socket: Socket) => {
        //TODO: handle admin namespace
        console.log(`Admin Socket connection!`, socket.id);
    });

    /**
     *  Register namespaces
     */
    namespaces.forEach((namespace) => {
        const thisNamespace = io.of(namespace.name);

        thisNamespace.on("connection", (socket: Socket) => {
            //console.log(namespace.name, socket.id);

            roomHandle(io, socket, thisNamespace);
            messageHandle(io, socket, thisNamespace)
        });
    })
}