import { Player } from "./player";

export interface InterServerEvents {}

export interface SocketData {}

export interface ServerEvents {
    response: (message: string) => void;
    "room:created": (code: number) => void;
    "room:join-player": (player: Player) => void;
    "room:error": (message: string) => void;
    "room:room-exists": (exists: boolean) => void;
    "player:joined-room": (player: Player) => void;
}

export interface ClientEvents {
    hello: () => void;
    "room:create": () => void;
    "room:check-exists": (code: number) => void;
    "player:join-room": (code: number, playername: string) => void;
}
