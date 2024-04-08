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
import checkExistRoom from "../libs/checkExistRoom";

export default function (
    socket: Socket<ClientEvents, ServerEvents, InterServerEvents, SocketData>,
    rooms: Array<Room>
) {
    const createRoom = (questions: Array<ICollectionQuestion>) => {
        // generar el código de la sala
        let codeGenerated: number;
        let exists: boolean = false;

        // verifico que no se creeen codigos de sala repetidos
        do {
            codeGenerated = getRandomNumber(100000, 100004);
            exists = checkExistRoom(rooms, codeGenerated);
        } while (exists);

        // agrego la sala creada al listado de sala
        rooms.push({
            code: codeGenerated,
            socketId: socket.id,
            players: [],
            status: "waiting",
            currentQuestion: -1,
            questions,
            hasNext: false,
            totalAnswers: 0,
        });

        socket.data = { code: codeGenerated, role: "moderator" };

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

    const closeRoom = (code: number) => {
        const roomFound = rooms.find((r) => r.code == code);

        if (roomFound) {
            rooms = rooms.filter((room) => room.code !== code);

            roomFound.players.forEach((p) => {
                socket.to(p.socketId).emit("room:closed-room");
            });
        }

        console.log(rooms);
    };

    socket.on("room:create", createRoom);
    socket.on("room:check-exists", checkRoomExists);
    socket.on("room:close-room", closeRoom);
}
