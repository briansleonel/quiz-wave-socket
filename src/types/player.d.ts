export interface Player {
    socketId: string;
    name: string;
    score: number;
    answers: Array<boolean>;
}
