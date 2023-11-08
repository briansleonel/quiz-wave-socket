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

const PORT = config.PORT;
const HOSTNAME = config.HOSTNAME;

const server = app.listen(PORT, () => {
    console.log(`🌐 Socket server started: http://localhost:${PORT}`);
});

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

    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
    });
});
