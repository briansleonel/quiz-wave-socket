import "dotenv/config";
import express from "express";
import cors from "cors";
import config from "./config/config";
import { Room } from "./types/room";
import createSocketAplication from "./app";

const PORT = config.PORT;

// crear aplicación de express
const app = express();

app.use(cors());

// instacia del servidor http usando express
const server = app.listen(PORT, () => {
    console.log(`🌐 Socket server started: http://localhost:${PORT}`);
});

const rooms: Array<Room> = [];

// crear la aplicación que escucha los eventos de socket.io
createSocketAplication(server, rooms);
