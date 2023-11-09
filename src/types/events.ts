import { Player } from "./player";

export interface InterServerEvents {}

export interface SocketData {}

export interface ServerEvents {
    response: (message: string) => void;
    "room:created": (code: number) => void;
    "player:joined-room": (player: Player) => void;
    "room:join-player": (player: Player) => void;
}

export interface ClientEvents {
    hello: () => void;
    "room:create": () => void;
    "player:join-room": (code: number) => void;
}
