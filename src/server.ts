import cluster from "cluster";
import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import os from "os";
import {setupMaster, setupWorker} from "@socket.io/sticky";
import {createAdapter, setupPrimary} from "@socket.io/cluster-adapter";
import {createAdapter as createAdapterRedis} from "@socket.io/redis-adapter";
import Redis from "ioredis";
import {registerHandler} from "./registers/handle.register";
import multer from "multer";
import path from "node:path";
import {SEND_MESSAGE} from "./constants";
import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import {IUser} from "./interfaces";

declare module 'http' {
  interface IncomingMessage {
    user: IUser;
  }
}

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

/**
 * APP
 */
const app = express();
app.use(bodyParser.json());
// const __dirname = dirname(fileURLToPath(import.meta.url));

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
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});
const upload = multer({storage});

/**
 * JWT
 */
const jwtSecret = "Mys3cr3t";

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

  cluster.on("exit", (worker: {process: {pid: any;};}) => {
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
      credentials: true,
    },
  });

  app.post("/shareFile", upload.single("file"), function(req, res, next): any {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // TODO: socket emit file to room
    //Send message to all connection
    io.emit(SEND_MESSAGE, req.file.path);
    return res.json({message: req.file.path});
  });

  app.post("/photos/upload", upload.array("photos", 12), function(req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  });

  /**
   * Auth
   */
  app.get("/self", passport.authenticate("jwt", {session: false}),
    (req, res) => {
      if (req.user) {
        res.send(req.user);
      } else {
        res.status(401).end();
      }
    },
  );

  app.post("/login", (req, res) => {
    //TODO: change logic validate user
    if (req.body.username === "john" && req.body.password === "changeit") {
      console.log("authentication OK");

      const user = {
        id: 1,
        username: "john",
      };

      const token = jwt.sign(
        {
          data: user,
        },
        jwtSecret,
        {
          issuer: "accounts.examplesoft.com",
          audience: "yoursite.net",
          expiresIn: "1h",
        },
      );

      res.json({token});
    } else {
      console.log("wrong credentials");
      res.status(401).end();
    }
  });

  const jwtDecodeOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
    issuer: "accounts.examplesoft.com",
    audience: "yoursite.net",
  };

  passport.use(
    new JwtStrategy(jwtDecodeOptions, (payload, done) => {
      return done(null, payload.data);
    }),
  );

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  // Register event socket
  registerHandler(io);

  const socketPort = process.env.SOCKET_PORT ? +process.env.SOCKET_PORT : 4000;

  httpServer.listen(socketPort);
}
