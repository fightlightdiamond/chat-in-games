import { Server } from 'socket.io';

export const exampleMiddleware = (io: Server) => {
    io.use(async (socket, next) => {
        try {
          //TODO something
        } catch (e) {
            next(new Error("unknown user"));
        }
    });
};
