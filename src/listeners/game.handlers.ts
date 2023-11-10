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

            socket.emit("quiz:started"); // envio el evento que se ha iniciado el juego al cliente

            // emito el evento que se ha iniciado el juego a todos los jugadores
            roomFound.players.forEach((p) => {
                socket.to(p.socketId).emit("quiz:started");
            });
        }
    };

    socket.on("quiz:start", startGame);
}
