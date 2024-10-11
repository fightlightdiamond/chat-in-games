import {IRoom} from "../interfaces";

export class Namespace {
  id: number;
  name: string;
  image: string;
  endpoint: string;
  rooms: IRoom[];

  constructor(id: number, name: string, image: string, endpoint: string) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(room: IRoom) {
    this.rooms.push(room)
  }

}