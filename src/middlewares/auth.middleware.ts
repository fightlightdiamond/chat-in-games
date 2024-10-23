import { Server } from 'socket.io';

export const authMiddleware = (io: Server) => {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        console.log('=============>TOKEN', token)
        if (token === 1) {
            // Check authentication here
            return next();
        }
        console.log("UnAuthentication")
        socket.disconnect();
        return next(new Error("Authentication error"));
    });
};
