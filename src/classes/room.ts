import {IRoom} from "../interfaces";

export class Room {
    attributes: IRoom;

    constructor(data: IRoom) {
        this.attributes = data;
    }
}