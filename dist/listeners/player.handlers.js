"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(socket, rooms) {
    /**
     * Permite que un jugador se una a una determinada sala.
     * Busca el codigo de sala recibido entre todas las salas disponibles.
     * @param code codigo de sala
     */
    const playerJoinRoom = (code, playername) => {
        // busco la sala de acuerdo al codigo
        const roomFound = rooms.find((r) => r.code == code);
        // verifico que se halla encontrado una sala y que el estado sea "waiting"
        if (roomFound && roomFound.status === "waiting") {
            const existingPlayername = roomFound.players.find((p) => p.name === playername);
            // verifico que no existe el nombre del jugador
            if (!existingPlayername) {
                // creo un nuevo jugador
                const player = {
                    socketId: socket.id,
                    name: playername,
                    answers: [],
                    score: 0,
                };
                // establezco socked data para un jugador
                socket.data = { code, role: "player", playername };
                roomFound.players.push(player); // agrego el nuevo jugador
                // envió al cliente moderador los datos del jugador que se unió
                socket.to(roomFound.socketId).emit("room:join-player", player);
                // envío al cliente jugador sus datos
                socket.emit("player:joined-room", player);
            }
            else {
                socket.emit("room:error", "Nombre de jugador existente");
            }
        }
        else {
            socket.emit("room:error", "No se puede ingresar a la sala");
        }
    };
    socket.on("player:join-room", playerJoinRoom);
}
exports.default = default_1;
