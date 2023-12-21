import {
    ClientEvents,
    InterServerEvents,
    ServerEvents,
    SocketData,
} from "../types/events";
import { Room } from "../types/room";
import { Socket } from "socket.io";

export default function (
    socket: Socket<ClientEvents, ServerEvents, InterServerEvents, SocketData>,
    rooms: Array<Room>
) {
    const startGame = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            roomFound.status = "started"; // etsablezco el estado de la sala en "started"
            roomFound.currentQuestion = 1;

            // emito el evento que se ha iniciado el juego a todos los jugadores
            roomFound.players.forEach((p) => {
                socket
                    .to(p.socketId)
                    //.emit("quiz:show-question", currentQuestion, hasNext);
                    .emit("quiz:started");
                //socket.to(p.socketId).emit("quiz:started");
            });

            socket.emit("quiz:started"); // envio el evento que se ha iniciado el juego al cliente
        }
    };

    const quizShowQuestion = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            const currentQuestion =
                roomFound.questions[roomFound.currentQuestion];
            const hasNext =
                roomFound.currentQuestion + 1 < roomFound.questions.length;

            // emito el evento que se ha iniciado el juego a todos los jugadores
            roomFound.players.forEach((p) => {
                socket
                    .to(p.socketId)
                    .emit("quiz:show-question", currentQuestion.question);
            });
        }
    };

    const changeCountdown = (count: number) => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            // emito el evento que se ha iniciado el juego a todos los jugadores
            roomFound.players.forEach((p) => {
                socket.to(p.socketId).emit("quiz:countdown", count);
            });
        }
    };

    socket.on("quiz:start", startGame);
    socket.on("quiz:show-question", quizShowQuestion);
    socket.on("quiz:countdown", changeCountdown);
}
