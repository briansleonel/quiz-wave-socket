import { Player } from "./player";

export interface InterServerEvents {}

export interface SocketData {}

export interface ServerEvents {
    response: (message: string) => void;
    "room:created": (code: number) => void;
    "room:join-player": (player: Player) => void;
    "room:error": (message: string) => void;
    "player:joined-room": (player: Player) => void;
    "player:adds-name": (player: Player) => void;
}

export interface ClientEvents {
    hello: () => void;
    "room:create": () => void;
    "player:join-room": (code: number) => void;
    "player:add-name": (player: Player, code: number) => void;
}
