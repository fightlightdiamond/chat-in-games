import {IUser} from "../interfaces/user.interface";
import axios, {AxiosResponse} from 'axios';
import {randomUUID} from "node:crypto";

const apiServer = process.env.API_SERVER || "http://localhost:3300"
const API_URL = `${apiServer}/users`;
/**
 * Login
 *
 * @param username
 * @param password
 */
export const login = async (username: string, password: string): Promise<IUser | null> => {
    const response: AxiosResponse<IUser[], any> = await axios.get(API_URL, {
        params: {
            username,
            password,
            _limit: 1
        }
    });

    const users = response.data;

    if (users.length > 0) {
        return users[0];
    }

    return null;
};

/**
 * Register
 *
 * @param username
 * @param password
 */
export const register = async (username: string, password: string): Promise<IUser | null> => {
    const response: AxiosResponse<IUser[], any> = await axios.get(API_URL, {
        params: {
            username,
            _limit: 1
        }
    });

    if (response.data.length > 0) throw new Error('Email has exist')

    return await axios.post(API_URL, {
        params: {
            username,
            password,
            token: randomUUID()
        }
    });
};
