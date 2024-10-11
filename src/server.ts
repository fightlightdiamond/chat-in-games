import cluster from "cluster";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const numCPUs = require("os").cpus().length;
import {setupMaster, setupWorker} from "@socket.io/sticky";
import {createAdapter, setupPrimary} from "@socket.io/cluster-adapter";
// import {IoConfig} from "./configs";

import { createAdapter as createAdapterA } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import {registerHandler} from "./registers/handle.register";

const redisPort = process.env.REDIS_PORT ? +process.env.REDIS_PORT : 63795;
console.log('redis port: ' + redisPort)
const pubClient = new Redis(redisPort);
const subClient = pubClient.duplicate();

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // const httpServer = http.createServer();

    // setup sticky sessions
    setupMaster(httpServer, {
        loadBalancingMethod: "least-connection",
    });

    // setup connections between the workers
    setupPrimary();

    cluster.setupPrimary({
        serialization: "advanced",
    });

    const appPort = process.env.APP_PORT ? +process.env.APP_PORT : 6000;
    httpServer.listen(appPort);
    console.log('appPort: ' + appPort)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker: { process: { pid: any; }; }) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} started`);

    const io = new Server(httpServer, {
        adapter: createAdapterA(pubClient, subClient),
        transports: ["websocket", "polling"],
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // use the cluster adapter
    io.adapter(createAdapter());

    // setup connection with the primary process
    setupWorker(io);

    // Register event socket
    registerHandler(io);

    const socketPort = process.env.SOCKET_PORT ? +process.env.SOCKET_PORT : 4000;
    console.log('socketPort: ' + socketPort)
    httpServer.listen(socketPort)
}
