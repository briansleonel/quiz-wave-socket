import "dotenv/config";
import { Server as SocketServer } from "socket.io";
import config from "./config/config";
import app from "./app";
import {
    ClientEvents,
    InterServerEvents,
    ServerEvents,
    SocketData,
} from "./types/socket";
import { getRandomNumber } from "./libs/generateRandomNumber";
import { Room } from "./types/room";

const PORT = config.PORT;

const server = app.listen(PORT, () => {
    console.log(`🌐 Socket server started: http://localhost:${PORT}`);
});

const roomsCreated: Array<Room> = [];

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

    socket.on("create-room", () => {
        // generar el código de la sala
        const codeGenerated = getRandomNumber(100000, 999999);

        // agrego la sala creada al listado de sala
        roomsCreated.push({
            code: codeGenerated,
            socketId: socket.id,
            players: [],
            status: "waiting",
        });

        console.log(roomsCreated);

        // emitir al cliente el código de la sala
        socket.emit("room-created", codeGenerated);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
    });
});
