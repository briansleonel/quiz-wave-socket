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

        if (roomFound && socket.data.role === "moderator") {
            roomFound.status = "started";
            socket.emit("quiz:started");
        }
    };

    socket.on("quiz:start", startGame);
}
