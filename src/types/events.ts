import { ICollectionQuestion } from "./collectionQuestion";
import { Player } from "./player";

export interface InterServerEvents {}

export interface SocketData {
    code: number;
    role: "moderator" | "player";
    playername?: string;
}

export interface ServerEvents {
    response: (message: string) => void;
    "room:created": (code: number, socketId: string) => void;
    "room:join-player": (player: Player) => void;
    "room:error": (message: string) => void;
    "room:room-exists": (exists: boolean) => void;
    "room:player-disconnected": (player: Player) => void;
    "player:joined-room": (player: Player) => void;
    "quiz:started": () => void;
    "quiz:show-question": (question: string) => void;
    "quiz:show-options": (options: Array<string>) => void;
    "quiz:countdown": (count: number) => void;
    "quiz:countdown-stopped": () => void;
    "quiz:ranking-moderator": (players: Array<Player>) => void;
    "quiz:ranking-player": (player: Player) => void;
}

export interface ClientEvents {
    hello: () => void;
    "room:create": (questions: Array<ICollectionQuestion>) => void;
    "room:check-exists": (code: number) => void;
    "player:join-room": (code: number, playername: string) => void;
    "quiz:start": () => void;
    "quiz:show-question": () => void;
    "quiz:show-options": () => void;
    "quiz:countdown": (count: number) => void;
    "quiz:stop-countdown": () => void;
    "quiz-player:send-answer": (index: number, countown: number) => void;
    "quiz:show-ranking-player": () => void;
}

/**
 * "quiz:show-question": (
        question: ICollectionQuestion,
        hasNext: boolean
    ) => void;
 */
