import axios from 'axios';
const apiServer = process.env.API_SERVER || "http://localhost:3300"
const API_URL = `${apiServer}/messages`;

/**
 * Message Save
 *
 * @param msg
 */
export const messageSave = (msg: string) => {
    return axios.post(API_URL, { message: msg });
}

/**
 * Message Paginate
 *
 * @param page
 * @param limit
 */
export const messagePaginate = ({id, limit}: {id: number, limit: number}) => {
    return axios.get(API_URL, {
        params: {
            _limit: limit,
            _sort: '-id',
            id_lte: id
        }
    });
}
