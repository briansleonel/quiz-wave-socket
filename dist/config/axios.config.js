"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__instanceAxios = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
/**
 * Establezco la instancia de axios para poder hacer consultas HTTP
 */
exports.__instanceAxios = axios_1.default.create({
    baseURL: config_1.default.QUIZ_WAVE_API_URL,
});
