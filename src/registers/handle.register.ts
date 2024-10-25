import {Server, Socket} from "socket.io";
import { messageHandle} from "../handles";
import {roomHandle} from "../handles";
import {namespaces} from "../seeder";
import {pubicHandle} from "../handles/public/pubic.handle";
import {authMiddleware} from "../middlewares";
import passport from "passport";
import {privateHandle} from "../handles/private/private.handle";

export const registerHandler = (io: Server) => {
    /**
     * Sharing the user context
     * The user context can be shared with the Socket.IO server by calling
     */
    io.engine.use((req: { _query: { sid: undefined; }; }, res: any, next: () => void) => {
        const isHandshake = req._query.sid === undefined;
        if (isHandshake) {
            passport.authenticate("jwt", { session: false })(req, res, next);
        } else {
            next();
        }
    });

    const defaultNamespace = io.of('/');
    // authMiddleware(io);
    const adminNamespace = io.of("/admin");

    /**
     * Default namespace
     */
    defaultNamespace.on("connection", (socket: Socket) => {
        const userId = socket.request.user.id;
        socket.join(userId.toString())

        // authMiddleware(io);
        pubicHandle(io, socket, defaultNamespace);
        privateHandle(io, socket)

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
            roomHandle(io, socket, thisNamespace);
            messageHandle(io, socket, thisNamespace)
        });
    })
}