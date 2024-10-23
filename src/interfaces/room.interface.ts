export interface IRoom {
    id: number;
    name: string;
    namespaceId: number;
    private: boolean;
    history: string[];
}