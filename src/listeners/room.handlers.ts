import {
    ClientEvents,
    InterServerEvents,
    ServerEvents,
    SocketData,
} from "../types/events";
import { getRandomNumber } from "../libs/generateRandomNumber";
import { Room } from "../types/room";
import { Socket } from "socket.io";
import { ICollectionQuestion } from "../types/collectionQuestion";

export default function (
    socket: Socket<ClientEvents, ServerEvents, InterServerEvents, SocketData>,
    rooms: Array<Room>
) {
    const createRoom = (questions: Array<ICollectionQuestion>) => {
        // generar el código de la sala
        const codeGenerated = getRandomNumber(100000, 999999);

        // agrego la sala creada al listado de sala
        rooms.push({
            code: codeGenerated,
            socketId: socket.id,
            players: [],
            status: "waiting",
            currentQuestion: -1,
            questions,
            hasNext: false,
        });

        socket.data = { code: codeGenerated, role: "moderator" };

        console.log(rooms);

        // emitir al cliente el código de la sala
        socket.emit("room:created", codeGenerated, socket.id);
    };

    const checkRoomExists = (code: number) => {
        // busco la sala de acuerdo al codigo recibido
        const roomFound = rooms.find((r) => r.code == code);

        // verifico que se halla encontrado una sala
        if (roomFound) {
            socket.emit("room:room-exists", true);
        } else {
            socket.emit("room:room-exists", false);
            socket.emit(
                "room:error",
                "Sala no encontrada, verifique el código"
            );
        }
    };

    socket.on("room:create", createRoom);
    socket.on("room:check-exists", checkRoomExists);
}
