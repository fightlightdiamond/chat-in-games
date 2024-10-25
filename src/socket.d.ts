import {IUser} from "./src/interfaces";

declare module "socket.io" {
  interface Socket {
    user?: IUser;
  }
}
