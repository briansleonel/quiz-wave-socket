"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkExistRoom(rooms, code) {
    const exist = rooms.find((r) => r.code === code);
    if (exist)
        return true;
    return false;
}
exports.default = checkExistRoom;
