export interface InterServerEvents {}

export interface SocketData {}

export interface ServerEvents {
    response: (message: string) => void;
}

export interface ClientEvents {
    hello: () => void;
}
