"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./http/app"));
const app_2 = __importDefault(require("./ws/app"));
const server = http_1.default.createServer(app_1.default);
// Attach WebSocket server to HTTP server
server.on("upgrade", (req, socket, head) => {
    app_2.default.handleUpgrade(req, socket, head, (ws) => {
        app_2.default.emit("connection", ws, req);
    });
});
// Start the combined server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
