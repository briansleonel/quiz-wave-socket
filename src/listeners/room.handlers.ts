import {
    ClientEvents,
    InterServerEvents,
    ServerEvents,
    SocketData,
} from "../types/events";
import { getRandomNumber } from "../libs/generateRandomNumber";
import { Room } from "../types/room";
import { Socket } from "socket.io";

export default function (
    socket: Socket<ClientEvents, ServerEvents, InterServerEvents, SocketData>,
    rooms: Array<Room>
) {
    const createRoom = () => {
        // generar el código de la sala
        const codeGenerated = getRandomNumber(100000, 999999);

        // agrego la sala creada al listado de sala
        rooms.push({
            code: codeGenerated,
            socketId: socket.id,
            players: [],
            status: "waiting",
        });

        console.log(rooms);

        // emitir al cliente el código de la sala
        socket.emit("room-created", codeGenerated);
    };

    socket.on("create-room", createRoom);
}
