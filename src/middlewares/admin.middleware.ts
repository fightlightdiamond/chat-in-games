import { Server } from 'socket.io';

export const adminMiddleware = (io: Server) => {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
            // Check authentication here
            return next();
        }
        return next(new Error("Authentication error"));
    });
};
