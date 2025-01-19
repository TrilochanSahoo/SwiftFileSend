import http from 'http'
import expressApp from './http/app'
import wsServer from './ws/app'

const server = http.createServer(expressApp);

// Attach WebSocket server to HTTP server
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (ws) => {
    wsServer.emit("connection", ws, req);
  });
});

// Start the combined server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});