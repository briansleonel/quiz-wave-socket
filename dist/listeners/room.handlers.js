"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomNumber_1 = require("../libs/generateRandomNumber");
const checkExistRoom_1 = __importDefault(require("../libs/checkExistRoom"));
const axios_config_1 = require("../config/axios.config");
const axios_1 = require("axios");
function default_1(socket, rooms) {
    const createRoom = (id) => __awaiter(this, void 0, void 0, function* () {
        // generar el código de la sala
        let codeGenerated;
        let exists = false;
        try {
            const response = yield axios_config_1.__instanceAxios.get(`/collections/${id}`, {
                headers: {
                    Authorization: `Bearer ${socket.handshake.auth.token}`,
                },
            });
            const data = response.data;
            // verifico que no se creeen codigos de sala repetidos
            do {
                codeGenerated = (0, generateRandomNumber_1.getRandomNumber)(100000, 999999);
                exists = (0, checkExistRoom_1.default)(rooms, codeGenerated);
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
            socket.emit("room:created", codeGenerated, socket.id, data.data.questions);
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError && error.response)
                socket.emit("room:error", error.response.data.message);
            else
                socket.emit("room:error", "Internal Server Error");
        }
    });
    const checkRoomExists = (code) => {
        // busco la sala de acuerdo al codigo recibido
        const roomFound = rooms.find((r) => r.code == code);
        // verifico que se halla encontrado una sala
        if (roomFound) {
            socket.emit("room:room-exists", true);
        }
        else {
            socket.emit("room:room-exists", false);
            socket.emit("room:error", "Sala no encontrada, verifique el código");
        }
    };
    const closeRoom = (code) => {
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
exports.default = default_1;
