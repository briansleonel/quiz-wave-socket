export interface InterServerEvents {}

export interface SocketData {}

export interface ServerEvents {
    response: (message: string) => void;
    "room-created": (code: number) => void;
}

export interface ClientEvents {
    hello: () => void;
    "create-room": () => void;
}
