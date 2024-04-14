"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const room_handlers_1 = __importDefault(require("./listeners/room.handlers"));
const player_handlers_1 = __importDefault(require("./listeners/player.handlers"));
const game_handlers_1 = __importDefault(require("./listeners/game.handlers"));
function createSocketAplication(server, rooms) {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.on("connect", (socket) => {
        console.log("Client connected: " + socket.id);
        socket.on("hello", () => {
            socket.emit("response", "Hola desde el servidor");
        });
        // eventos para las salas
        (0, room_handlers_1.default)(socket, rooms);
        (0, player_handlers_1.default)(socket, rooms);
        (0, game_handlers_1.default)(socket, rooms);
        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
            // Busco el la sala en la que se encuentra un jugador que se desconecto, de acuero al codigo de sala en socket.data
            const roomFound = rooms.find((room) => room.code === socket.data.code &&
                socket.data.role === "player");
            // Verifico si se encontró la sala
            if (roomFound) {
                // busco el jugador que se desconecto
                const playerDisconnected = roomFound.players.find((player) => player.socketId === socket.id);
                if (playerDisconnected) {
                    // filtro los jugadores de la sala quitanod el jugador que se desconecto
                    const playersUpdated = roomFound.players.filter((player) => player !== playerDisconnected);
                    // actualizo la lista de jugadores de la sala
                    roomFound.players = playersUpdated;
                    // emito al moderador de la sala el jugador que se desconectó
                    socket
                        .to(roomFound.socketId)
                        .emit("room:player-disconnected", playerDisconnected);
                }
            }
        });
    });
    return io;
}
exports.default = createSocketAplication;
