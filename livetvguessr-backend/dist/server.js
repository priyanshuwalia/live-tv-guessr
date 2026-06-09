"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const passport_1 = __importDefault(require("./auth/passport"));
const auth_1 = __importDefault(require("./routes/auth"));
const channels_1 = __importDefault(require("./routes/channels"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
// 1. Initialize native WebSocket Server attached to the HTTP server
const wss = new ws_1.WebSocketServer({ server });
// 2. In-memory Room Manager
// Maps a roomId to a Set of active WebSocket connections
const rooms = new Map();
wss.on('connection', (ws) => {
    // Generate a quick random ID for this connection
    const connectionId = crypto_1.default.randomUUID();
    console.log(`🔌 New client connected: ${connectionId}`);
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            const { type, roomId, payload } = parsedMessage;
            switch (type) {
                case 'join_room':
                    // Initialize the room if it doesn't exist
                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Set());
                    }
                    // Add this socket to the room
                    rooms.get(roomId)?.add(ws);
                    console.log(`User ${connectionId} joined room ${roomId}`);
                    // Broadcast to others in the room
                    broadcastToRoom(roomId, ws, {
                        type: 'player_joined',
                        playerId: connectionId
                    });
                    break;
                case 'submit_guess':
                    // Handle gameplay logic here later
                    console.log(`Guess received in room ${roomId}:`, payload);
                    break;
                default:
                    console.log('Unknown message type:', type);
            }
        }
        catch (error) {
            console.error('Failed to parse WebSocket message', error);
        }
    });
    ws.on('close', () => {
        console.log(`❌ Client disconnected: ${connectionId}`);
        // Cleanup: Remove this socket from any rooms it was in
        rooms.forEach((clients, roomId) => {
            if (clients.has(ws)) {
                clients.delete(ws);
                if (clients.size === 0) {
                    rooms.delete(roomId); // Destroy empty rooms to prevent memory leaks
                }
            }
        });
    });
});
// Helper function to broadcast to everyone in a room EXCEPT the sender
function broadcastToRoom(roomId, senderWs, message) {
    const clients = rooms.get(roomId);
    if (clients) {
        const messageString = JSON.stringify(message);
        clients.forEach((client) => {
            if (client !== senderWs && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    }
}
app.get('/api/health', (req, res) => {
    res.json({ status: 'LiveTVGuessr API running with native WS!' });
});
app.use(passport_1.default.initialize());
// Mount the Auth Routes
app.use('/api/auth', auth_1.default);
app.use('/api/channels', channels_1.default);
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
