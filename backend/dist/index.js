"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const server = http_1.default.createServer((req, res) => {
    res.end("hi there server running.");
});
const spaces = new Map();
const wss = new ws_1.WebSocketServer({ server });
let count = 0;
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
wss.on('connection', (socket, req) => {
    const query = (0, url_1.parse)(req.url || '', true).query;
    const spaceId = query["spaceId"];
    console.log(spaceId);
    socket.on("error", console.error);
    socket.on("message", (data, isBinary) => {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === 'register' && parsedData.role === 'user' && parsedData.access === "false") {
            // spaceId = parsedData.spaceId
            const spaId = spaceId;
            if (spaces.has(spaId)) {
                const space = spaces.get(spaId);
                console.log(space);
                let userId = 'user' + makeid(7);
                space.forEach((sp) => {
                    const [roleData, userData, accessData, connection] = sp;
                    const [roleType, role] = roleData;
                    const [type, client] = connection;
                    // console.log(client)
                    // console.log('socketArray:', socketArray, 'Type:', typeof socketArray);
                    if (role === "admin") {
                        if (client != socket && client.readyState === ws_1.default.OPEN) {
                            client.send(JSON.stringify({
                                access: false,
                                user: userId
                            }));
                        }
                    }
                });
                space.add([["role", parsedData.role], ["id", userId], ["access", parsedData.access], ["con", socket]]);
            }
        }
        else if (parsedData.type === 'register' && parsedData.access === 'true') {
            // spaceId = parsedData.spaceId
            if (!spaces.has(spaceId)) {
                spaces.set(spaceId, new Set());
            }
            if (parsedData.role === 'user') {
                const space = spaces.get(spaceId);
                space.forEach((sp) => {
                    const [roleData, userData, accessData, connection] = sp;
                    const [type, client] = connection;
                    if (userData[1] === parsedData.userId) {
                        accessData[1] = parsedData.access;
                        if (client != socket && client.readyState === ws_1.default.OPEN) {
                            client.send(JSON.stringify({
                                responseType: 200,
                                message: 'Access Granted'
                            }));
                        }
                    }
                });
            }
            else {
                spaces.get(spaceId).add([["role", parsedData.role], ["id", parsedData.userId], ["access", parsedData.access], ["con", socket]]);
            }
            console.log(`User added to group: ${spaceId}`);
        }
        else if (parsedData.type === 'remove') {
            const space = spaces.get(spaceId);
            space.forEach((sp) => {
                const [roleData, userData, accessData, connection] = sp;
                const [type, client] = connection;
                if (userData[1] === parsedData.userId) {
                    if (client != socket && client.readyState === ws_1.default.OPEN) {
                        client.send(JSON.stringify({
                            responseType: 404,
                            message: 'Unauthorized User'
                        }));
                        client.close(1000, 'Unauthorized User');
                    }
                    space.delete(sp);
                }
            });
        }
        else if (parsedData.type === 'message') {
            const spaId = spaceId;
            if (spaces.has(spaId)) {
                const space = spaces.get(spaId);
                space.forEach((client) => {
                    if (client != socket && client.readyState === ws_1.default.OPEN) {
                        client.send(data, { binary: isBinary });
                    }
                });
            }
            else {
                socket.send(JSON.stringify({ error: 'Group not found or user not registered' }));
            }
        }
    });
    console.log("user connected", ++count);
});
server.listen(8080, () => {
    console.log("server is running on port 8080");
});
