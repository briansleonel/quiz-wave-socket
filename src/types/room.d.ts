import { ICollectionQuestion } from "./collectionQuestion";
import { Player } from "./player";
import { StatusRoom } from "./status-room";

export interface Room {
    socketId: string;
    code: number;
    players: Array<Player>;
    status: StatusRoom;
    currentQuestion: number;
    questions: Array<ICollectionQuestion>;
    hasNext: boolean;
}
