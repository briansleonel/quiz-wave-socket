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
        socket.on("hello", () => {
            socket.emit("response", "Hola desde el servidor");
        });

        // eventos para las salas
        roomHandlers(socket, rooms);
        playerHandlers(socket, rooms);
        gameHandlers(socket, rooms);

        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
        });
    });

    return io;
}
