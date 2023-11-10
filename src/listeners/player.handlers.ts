import {
    ClientEvents,
    InterServerEvents,
    ServerEvents,
    SocketData,
} from "../types/events";
import { Room } from "../types/room";
import { Socket } from "socket.io";
import { Player } from "../types/player";

export default function (
    socket: Socket<ClientEvents, ServerEvents, InterServerEvents, SocketData>,
    rooms: Array<Room>
) {
    /**
     * Permite que un jugador se una a una determinada sala.
     * Busca el codigo de sala recibido entre todas las salas disponibles.
     * @param code codigo de sala
     */
    const playerJoinRoom = (code: number, playername: string) => {
        // busco la sala de acuerdo al codigo
        const roomFound = rooms.find((r) => r.code == code);

        // verifico que se halla encontrado una sala y que el estado sea "waiting"
        if (roomFound && roomFound.status === "waiting") {
            // creo un nuevo jugador
            const player: Player = {
                socketId: socket.id,
                name: playername,
                answers: [],
                score: 0,
            };

            roomFound.players.push(player); // agrego el nuevo jugador

            // envió al cliente moderador los datos del jugador que se unió
            socket.to(roomFound.socketId).emit("room:join-player", player);

            // envío al cliente jugador sus datos
            socket.emit("player:joined-room", player);
        } else {
            socket.emit("room:error", "No se puede ingresar a la sala");
        }
    };

    socket.on("player:join-room", playerJoinRoom);
}
