import {Server, Socket} from "socket.io";
import {orderHandle, messageHandle} from "../handles";
import {namespaces} from "../constants";

export const registerHandler = (io: Server) => {
    const defaultNamespace = io.of("/");
    const adminNamespace = io.of("/admin");

    // const wikiNamespace = io.of("/wiki");
    // const mozillaNamespace = io.of("/mozilla");
    // const linuxNamespace = io.of("/linux");

    defaultNamespace.on("connection", (socket: Socket) => {
        console.log(`Socket connection`, socket.id);

        socket.on("hello", (err) => {
            socket.emit("ohello", 123)
        });

        socket.on("error", (err) => {
            // ...
        });

        socket.on("disconnecting", (reason) => {
            console.log("disconnecting")
        });

        socket.on("disconnect", (reason) => {
            console.log("disconnect")
        });

        orderHandle(io, socket)
        messageHandle(io, socket)

        adminNamespace.emit("userJoinedMainNs", "")

        socket.join('chat');
        socket.join('adminChat');
        defaultNamespace
            .to("chat")
            .to("adminChat")
            .emit("welcomeToChatRoom", {})
    });

    adminNamespace.on("connection", (socket: Socket) => {
        console.log(`Admin Socket connection`, socket.id);
        messageHandle(io, socket)
        adminNamespace.emit('messageToClientsFromAdmin', {})

        socket.join("chat")
        adminNamespace
            .to("chat")
            // .to("adminChat")
            .emit("welcomeToChatRoom", {})
    });

    namespaces.forEach((namespace) => {
        const thisNs = io.of(namespace.name);

        thisNs.on("connection", (socket: Socket) => {
            console.log(`Admin Socket connection`, socket.id);
            messageHandle(io, socket)
            thisNs.emit('messageToClientsFromAdmin', {})

            socket.join("chat")
            thisNs
                .to("chat")
                // .to("adminChat")
                .emit("welcomeToChatRoom", {})
        });
    })
}