import {Namespace} from "../classes/namespace";
import {Room} from "../classes/room";
import {IRoom} from "../interfaces";

export const wikiNs = new Namespace(1, 'wiki', '', '');
export const mozNs = new Namespace(2, 'mozilla', '', '');
export const linuxNs = new Namespace(3, 'linux', '', '');

const room1 = {
    id: 1,
    name: 'string',
    namespaceId: 1,
    private: false,
    history: [],
} as IRoom

const room2 = {
    id: 2,
    name: 'room2',
    namespaceId: 1,
    private: false,
    history: [],
} as IRoom

wikiNs.addRoom(new Room(room1).attributes)
wikiNs.addRoom(new Room(room2).attributes)

const room11 = {
    id: 11,
    name: 'Firefox',
    namespaceId: 1,
    private: false,
    history: [],
} as IRoom

const room12 = {
    id: 12,
    name: 'Rust',
    namespaceId: 1,
    private: false,
    history: [],
} as IRoom

mozNs.addRoom(new Room(room11).attributes)
mozNs.addRoom(new Room(room12).attributes)

export const namespaces = [wikiNs, mozNs, linuxNs];