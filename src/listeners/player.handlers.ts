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

        // verifico que se halla encontrado una sala
        if (roomFound) {
            // verifico que el estado sea "waiting"
            if (roomFound.status === "waiting") {
                console.log("Socket player: " + socket.id);
                console.log("Code room: " + code);

                roomFound.players = [...roomFound.players, player];

                // envió al cliente moderador los datos del jugador que se unió
                socket.to(roomFound.socketId).emit("room:join-player", player);

                // envío al cliente jugador sus datos
                socket.emit("player:joined-room", player);
            } else {
                socket.emit("room:error", "No se puede ingresar a la sala");
            }
        } else {
            socket.emit(
                "room:error",
                "Sala no encontrada, verifique el código"
            );
        }
    };

    /**
     * Permite agregar el nombre de un jugador que se ha unido a alguna sala.
     * Una vez que se agrega el nombre del jugador, se envía los datos al moderador.
     * @param player ddatos del jugador
     * @param code codigo de la sala
     */
    const playerAddName = (player: Player, code: number) => {
        let roomFound = rooms.find((r) => r.code == code);

        // verifico que se halla encontrado una sala y el estado sea "waiting"
        if (roomFound && roomFound.status === "waiting") {
            let playerFound = roomFound.players.find(
                (p) => p.socketId == player.socketId
            );

            if (playerFound) {
                playerFound.name = player.name;

                socket
                    .to(roomFound.socketId)
                    .emit("player:adds-name", playerFound);

                console.log("Players: " + rooms[0].players);
            }
        }
    };

    socket.on("player:join-room", playerJoinRoom);
    socket.on("player:add-name", playerAddName);
}
