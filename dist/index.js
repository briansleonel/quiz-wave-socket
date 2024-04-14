"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const app_1 = __importDefault(require("./app"));
const PORT = config_1.default.PORT;
// crear aplicación de express
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// instacia del servidor http usando express
const server = app.listen(PORT, () => {
    console.log(`🌐 Socket server started: http://localhost:${PORT}`);
});
const rooms = [];
// crear la aplicación que escucha los eventos de socket.io
(0, app_1.default)(server, rooms);
