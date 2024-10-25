import { Server } from 'socket.io';
import {getUserByToken} from "../services/user.service";

export const authMiddleware = (io: Server) => {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers?.token;
        console.log('TOKEN', token);
        //TODO: after change login check token

        const user = await getUserByToken(token);
        // console.log(user)
        if (user) {
            socket.request.push(user);
            socket.join(`self_${user.id}`);
            return next();
        }
        console.log("UnAuthentication")
        socket.disconnect();

        return next(new Error("Authentication error"));
    });
};
