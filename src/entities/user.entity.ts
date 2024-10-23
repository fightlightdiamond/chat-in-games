import {IUser} from "../interfaces/user.interface";

export class UserEntity implements IUser {
    id!: number;
    email!: number;
    password!: string;
    token!: string;

    protected table = 'users';

    constructor(data: Partial<UserEntity>) {
        Object.assign(this, data);
    }
}