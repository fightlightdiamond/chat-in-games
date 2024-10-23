import cluster from "cluster";
import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import os from "os"
import {setupMaster, setupWorker} from "@socket.io/sticky";
import {createAdapter, setupPrimary} from "@socket.io/cluster-adapter";
import {createAdapter as createAdapterRedis} from "@socket.io/redis-adapter";
import Redis from "ioredis";
import {registerHandler} from "./registers/handle.register";
import multer from "multer";
import path from "node:path";
import {SEND_MESSAGE} from "./constants";

/**
 * APP
 */
const app = express();
const httpServer = createServer(app);
const numCPUs = os.cpus().length;
/**
 * Redis
 */
const redisPort = process.env.REDIS_PORT ? +process.env.REDIS_PORT : 63795;
const pubClient = new Redis(redisPort);
const subClient = pubClient.duplicate();
/**
 * multer
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});
const upload = multer({storage})

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // setup sticky sessions
    setupMaster(httpServer, {
        loadBalancingMethod: "least-connection",
    });

    cluster.setupPrimary({
        serialization: "advanced",
    });

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker: { process: { pid: any; }; }) => {
        console.log(`Worker ${worker.process.pid} died`);
        // cluster.fork();
    });

    // setup connections between the workers
    setupPrimary();
} else {
    console.log(`Worker ${process.pid} started`);

    const io = new Server(httpServer, {
        adapter: createAdapterRedis(pubClient, subClient),
        transports: ["websocket", "polling"],
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    app.post('/shareFile', upload.single('file'), function (req, res, next): any {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        console.log(req.file.path);

        //const filePath = path.join(__dirname, req.file.path);
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        // TODO: socket emit file to room
        //Send message to all connection
        io.emit(SEND_MESSAGE, req.file.path)
        return res.json({message: req.file.path})
    })

    app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
        // req.files is array of `photos` files
        // req.body will contain the text fields, if there were any
    })

    // use the cluster adapter
    io.adapter(createAdapter());

    // setup connection with the primary process
    setupWorker(io);

    // Register event socket
    registerHandler(io);

    const socketPort = process.env.SOCKET_PORT ? +process.env.SOCKET_PORT : 4000;

    httpServer.listen(socketPort)
}
