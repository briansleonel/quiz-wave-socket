import { Room } from "../types/room";

export default function checkExistRoom(rooms: Array<Room>, code: number) {
    const exist = rooms.find((r) => r.code === code);

    if (exist) return true;
    return false;
}
