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
            roomFound.hasNext =
                roomFound.questions.length < roomFound.currentQuestion + 1;

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

    /**
     * Permite escuchar el evento cuando se finaliza la cuenta regresiva en el cliente del moderador, y es emitido a todos los jugadores conectados
     */
    const stopCountdown = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            // numero de preguntas realizadas
            const numQuestion = roomFound.currentQuestion + 1;

            // verifico si hay un jugador que no llego a responder las preguntas
            roomFound.players.forEach((p) => {
                if (p.answers.length < numQuestion) {
                    p.answers.push(false);
                }
            });

            // emito el evento que se ha finalizado el contador a todos los jugadores
            roomFound.players.forEach((p) => {
                socket.to(p.socketId).emit("quiz:countdown-stopped");
            });

            //socket.emit("quiz:ranking-moderator", roomFound.players);
        }
    };

    /**
     * Permite esuchar el evento cuando un jugador selecciona una opción de todas las disponibles, y se almacena dentro de sus datos del jugador
     * @param index indice de la opción seleccionada
     */
    const sendAnswerPlayer = (index: number, countown: number) => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "player") {
            const currentQuestion =
                roomFound.questions[roomFound.currentQuestion];

            // recorro el array de jugadores y busco el que coincida con el jugador que realiza la acción
            roomFound.players.every((p) => {
                if (p.socketId === socket.id) {
                    // verifico si la opción seleccionada es correcta o no y la guardo entre sus respuestas
                    p.answers.push(currentQuestion.correct === index);

                    // verifico que si la opcion es correcta para asignar los puntos correspondientes
                    if (currentQuestion.correct === index) {
                        p.score += countown;
                    }
                    return false;
                }
                return true;
            });
        }
    };

    /**
     * Evento que permite enviar el ranking de los jugadores al moderador
     */
    const getRankingModerator = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            // Ordeno los jugadores de forma descendente de acuerdo a su SCORE
            roomFound.players.sort((a, b) =>
                a.score < b.score ? 1 : a.score > b.score ? -1 : 0
            );

            socket.emit("quiz:ranking-moderator", roomFound.players);
        }
    };

    /**
     * Permite escuchar el evento cuando el moderator indica que puede mostrar su score a cada participante
     */
    const showRankingPlayer = () => {
        const roomFound = rooms.find((r) => r.code == socket.data.code);

        // verifico que se encuentre la sala
        if (roomFound && socket.data.role === "moderator") {
            roomFound.players.forEach((p) => {
                socket.to(p.socketId).emit("quiz:ranking-player", p);
            });
        }
    };

    socket.on("quiz:start", startGame);
    socket.on("quiz:show-question", quizShowQuestion);
    socket.on("quiz:show-options", quizShowOptions);
    socket.on("quiz:countdown", changeCountdown);
    socket.on("quiz:stop-countdown", stopCountdown);
    socket.on("quiz-player:send-answer", sendAnswerPlayer);
    socket.on("quiz:get-ranking-moderator", getRankingModerator);
    socket.on("quiz:show-ranking-player", showRankingPlayer);
}
