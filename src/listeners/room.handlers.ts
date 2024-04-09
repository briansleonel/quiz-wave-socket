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
import { __instanceAxios } from "../config/axios.config";
import { APIResponse } from "../types/api";
import { ICollection } from "../types/collection";
import { AxiosError } from "axios";

export default function (
    socket: Socket<ClientEvents, ServerEvents, InterServerEvents, SocketData>,
    rooms: Array<Room>
) {
    const createRoom = async (id: string) => {
        // generar el código de la sala
        let codeGenerated: number;
        let exists: boolean = false;

        try {
            const response = await __instanceAxios.get(`/collections/${id}`, {
                headers: {
                    Authorization: `Bearer ${socket.handshake.auth.token}`,
                },
            });

            const data: APIResponse<ICollection> = response.data;

            // verifico que no se creeen codigos de sala repetidos
            do {
                codeGenerated = getRandomNumber(100000, 999999);
                exists = checkExistRoom(rooms, codeGenerated);
            } while (exists);

            // agrego la sala creada al listado de sala
            rooms.push({
                code: codeGenerated,
                socketId: socket.id,
                players: [],
                status: "waiting",
                currentQuestion: -1,
                questions: data.data.questions,
                hasNext: false,
                totalAnswers: 0,
            });

            // establezco socket data para el moderador
            socket.data = { code: codeGenerated, role: "moderator" };

            // emitir al cliente el código de la sala
            socket.emit(
                "room:created",
                codeGenerated,
                socket.id,
                data.data.questions
            );
        } catch (error) {
            if (error instanceof AxiosError && error.response)
                socket.emit("room:error", error.response.data.message);
            else socket.emit("room:error", "Internal Server Error");
        }
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
    };

    socket.on("room:create", createRoom);
    socket.on("room:check-exists", checkRoomExists);
    socket.on("room:close-room", closeRoom);
}
