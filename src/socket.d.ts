import { Socket } from "socket.io";
import {IUser} from "./src/interfaces";

declare module "socket.io" {
  interface Socket {
    user?: IUser;
  }
}
