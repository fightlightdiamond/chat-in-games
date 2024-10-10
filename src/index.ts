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

const port = process.env.APP_PORT ? +process.env.APP_PORT : 63795;
const pubClient = new Redis(port);
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

    httpServer.listen(3000);

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

    io.on("connection", (socket: {
        on: (arg0: string, arg1: {
            (err: any): void;
            (err: any): void;
            (reason: any): void;
            (reason: any): void;
        }) => void;
        emit: (arg0: string, arg1: number) => void;
    }) => {
        console.log(`Socket connection`);

        socket.on("hello", (err) => {
            socket.emit("ohello", 123)
        });

        socket.on("error", (err) => {
            // ...
        });

        socket.on("disconnecting", (reason) => {
            console.log("disconnecting")
            // ...
            // for (const room of socket.rooms) {
            //     if (room !== socket.id) {
            //         socket.to(room).emit("user has left", socket.id);
            //     }
            // }
        });

        socket.on("disconnect", (reason) => {
            console.log("disconnect")
        });
    });

    httpServer.listen(4000)
}
