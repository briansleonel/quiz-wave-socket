import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import {
    ClientEvents,
    InterServerEvents,
    ServerEvents,
    SocketData,
} from "./types/events";
import { Room } from "./types/room";
import roomHandlers from "./listeners/room.handlers";
import playerHandlers from "./listeners/player.handlers";
import gameHandlers from "./listeners/game.handlers";

export default function createSocketAplication(
    server: HttpServer,
    rooms: Array<Room>
) {
    const io = new SocketServer<
        ClientEvents,
        ServerEvents,
        InterServerEvents,
        SocketData
    >(server, { cors: { origin: "*" } });

    io.on("connect", (socket) => {
        console.log("Client connected: " + socket.id);
        socket.on("hello", () => {
            socket.emit("response", "Hola desde el servidor");
        });

        // eventos para las salas
        roomHandlers(socket, rooms);
        playerHandlers(socket, rooms);
        gameHandlers(socket, rooms);

        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
            // Busco el la sala en la que se encuentra un jugador que se desconecto, de acuero al codigo de sala en socket.data
            const roomFound = rooms.find(
                (room) =>
                    room.code === socket.data.code &&
                    socket.data.role === "player"
            );

            // Verifico si se encontró la sala
            if (roomFound) {
                // busco el jugador que se desconecto
                const playerDisconnected = roomFound.players.find(
                    (player) => player.socketId === socket.id
                );

                if (playerDisconnected) {
                    // filtro los jugadores de la sala quitanod el jugador que se desconecto
                    const playersUpdated = roomFound.players.filter(
                        (player) => player !== playerDisconnected
                    );

                    // actualizo la lista de jugadores de la sala
                    roomFound.players = playersUpdated;

                    // emito al moderador de la sala el jugador que se desconectó
                    socket
                        .to(roomFound.socketId)
                        .emit("room:player-disconnected", playerDisconnected);
                }
            }
        });
    });

    return io;
}
