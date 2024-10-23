import axios, {AxiosResponse} from "axios";
import {LoadMessagesResponse} from "../../interfaces";

export default abstract class Base {
    domain = 'http://localhost:3300'
    table = ''
    url = `${this.domain}/${this.table}`;

    save(data: any): Promise<AxiosResponse> {
        return axios.post(`${this.url}`, data);
    };

    loadMessages(limit: number, before?: number): Promise<AxiosResponse<LoadMessagesResponse>> {
        return axios.get(`${this.url}`, {
            params: {
                limit,
                before // Nếu có `before`, sẽ lấy các tin nhắn cũ hơn
            }
        });
    };
}