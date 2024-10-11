import {IRoom} from "../interfaces";

export class Room {
    attributes: IRoom;

    constructor(data: IRoom) {
        this.attributes = data;
    }

    addMessage(message: string) {
        this.attributes.history.push(message);
    }

    clearHistory() {
        this.attributes.history = [];
    }
}