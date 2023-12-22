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
    /**
     * Permite escuchar al evento 'quiz:start', que indica que se ha iniciado el juego.
     * Se cambia el estado de la sala a 'started' y se indica la pregunta actual
     * Además se emite un evento a todos los jugadores indicando que el juego ha empezado.
     */
    const startGame = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            roomFound.status = "started"; // etsablezco el estado de la sala en "started"
            roomFound.currentQuestion = 0;

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

    /**
     * Permite escuchar al evento 'quiz:show-question', el cual indica que se va a mostrar la pregunta correspondiente a todos los jugadores
     * conectados en la partida
     */
    const quizShowQuestion = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            const currentQuestion =
                roomFound.questions[roomFound.currentQuestion];

            // emito el evento que se ha iniciado el juego a todos los jugadores
            roomFound.players.forEach((p) => {
                socket
                    .to(p.socketId)
                    .emit("quiz:show-question", currentQuestion.question);
            });
        }
    };

    /**
     * Permite escuchar al evento 'quiz:show-options', el cual indica que se va a mostrar las opciones correspondientes a la pregunta.
     * Se emite un evento, en el cual se envía las opciones a todos los jugadores conectados a la partida
     */
    const quizShowOptions = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            const currentQuestion =
                roomFound.questions[roomFound.currentQuestion];

            // emito el evento que se ha iniciado el juego a todos los jugadores
            roomFound.players.forEach((p) => {
                socket
                    .to(p.socketId)
                    .emit("quiz:show-options", currentQuestion.options);
            });
        }
    };

    /**
     * Permite enviar, a todos los jugadores de una determinada sala, la cuenta regresiva correspondiente para ir comporbando el tiempo transcurrido
     * @param count cuenta regresiva
     */
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
    socket.on("quiz:show-options", quizShowOptions);
    socket.on("quiz:countdown", changeCountdown);
}
