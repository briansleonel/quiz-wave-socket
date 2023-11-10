import { Player } from "./player";

export interface InterServerEvents {}

export interface SocketData {
    code: number;
    role: "moderator" | "player";
}

export interface ServerEvents {
    response: (message: string) => void;
    "room:created": (code: number) => void;
    "room:join-player": (player: Player) => void;
    "room:error": (message: string) => void;
    "room:room-exists": (exists: boolean) => void;
    "player:joined-room": (player: Player) => void;
    "quiz:started": () => void;
}

export interface ClientEvents {
    hello: () => void;
    "room:create": () => void;
    "room:check-exists": (code: number) => void;
    "player:join-room": (code: number, playername: string) => void;
    "quiz:start": () => void;
}
