import { Server, Socket } from 'socket.io';
import {ORDER_CREATE, ORDER_READ} from "../constants";

interface CreateOrderPayload {
}

type ReadOrderCallback = (error: Error | null, data?: any) => void;

export const OrderHandle = (io: Server, socket: Socket) => {
    const createOrder = (payload: CreateOrderPayload): void => {
        // ...
    }

    const readOrder = (orderId: string, callback: ReadOrderCallback): void => {
        // ...
    }

    socket.on(ORDER_CREATE, createOrder);
    socket.on(ORDER_READ, readOrder);
}
