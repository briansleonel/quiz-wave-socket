import {
    ClientEvents,
    InterServerEvents,
    ServerEvents,
    SocketData,
} from "../types/events";
import { getRandomNumber } from "../libs/generateRandomNumber";
import { Room } from "../types/room";
import { Socket } from "socket.io";
import { Player } from "../types/player";

export default function (
    socket: Socket<ClientEvents, ServerEvents, InterServerEvents, SocketData>,
    rooms: Array<Room>
) {
    const playerJoinRoom = (code: number) => {
        // creo un nuevo jugador
        const player: Player = {
            socketId: socket.id,
            name: "",
            answers: [],
            score: 0,
        };

        // busco la sala de acuerdo al codigo
        const roomFound = rooms.find((r) => r.code == code);

        // verifico que se halla encontrado una sala y el estado sea "waiting"
        if (roomFound && roomFound.status === "waiting") {
            console.log("Socket player: " + socket.id);
            console.log("Code room: " + code);

            roomFound.players = [...roomFound.players, player];

            // envió al cliente moderador los datos del jugador que se unió
            socket.to(roomFound.socketId).emit("room:join-player", player);

            // envío al cliente jugador sus datos
            socket.emit("player:joined-room", player);

            console.log(roomFound);
        }
    };

    socket.on("player:join-room", playerJoinRoom);
}
