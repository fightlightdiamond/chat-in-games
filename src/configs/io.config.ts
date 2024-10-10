import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

const port = process.env.APP_PORT ? +process.env.APP_PORT : 63795;
const pubClient = new Redis(port);
const subClient = pubClient.duplicate();

export const IoConfig = {
    adapter: createAdapter(pubClient, subClient),
    transports: ["websocket", "polling"],
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
}