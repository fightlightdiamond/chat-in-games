import {Namespace} from "../classes/namespace";
import {Room} from "../classes/room";
import {IRoom, IRoomMessage, messageType} from "../interfaces";
import {faker} from '@faker-js/faker';

export const backend = new Namespace(1, 'Backend', '', '');
export const frontend = new Namespace(2, 'Frontend', '', '');
export const devops = new Namespace(3, 'Devops', '', '');

const room1 = {
    id: 1,
    name: 'PHP',
    namespaceId: 1,
} as IRoom

const room2 = {
    id: 2,
    name: 'Nodejs',
    namespaceId: 1,
} as IRoom

backend.addRoom(new Room(room1).attributes)
backend.addRoom(new Room(room2).attributes)

const room11 = {
    id: 11,
    name: 'Javascript',
    namespaceId: 1,
} as IRoom

const room12 = {
    id: 12,
    name: 'CSS',
    namespaceId: 1,
} as IRoom

frontend.addRoom(new Room(room11).attributes)
frontend.addRoom(new Room(room12).attributes)

const room111 = {
    id: 11,
    name: 'AWS',
    namespaceId: 1,
} as IRoom

const room112 = {
    id: 12,
    name: 'Google',
    namespaceId: 1,
} as IRoom

devops.addRoom(new Room(room111).attributes)
devops.addRoom(new Room(room112).attributes)

export const namespaces = [backend, frontend, devops];

const generateFakeMessage = (): IRoomMessage => {
    return {
        type: messageType.TEXT,
        id: faker.number.int({min: 1, max: 2}),
        roomId: faker.number.int({min: 1, max: 2}),
        roomName: faker.string.fromCharacters(['PHP', 'AWS']),
        senderId: faker.number.int({min: 1, max: 2}),
        message: faker.lorem.sentence(),
        timestamp: faker.date.recent()
    };
};

export const messages = Array.from({ length: Number(10) }, () => generateFakeMessage());
