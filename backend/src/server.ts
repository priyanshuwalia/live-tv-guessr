import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import passport from './auth/passport';
import authRoutes from './routes/auth';
import channelRoutes from './routes/channels';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());

const server = http.createServer(app);

// 1. Initialize native WebSocket Server attached to the HTTP server
const wss = new WebSocketServer({ server });

// 2. In-memory Room Manager
// Maps a roomId to a Set of active WebSocket connections
const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws: WebSocket) => {
    // Generate a quick random ID for this connection
    const connectionId = crypto.randomUUID();
    console.log(`🔌 New client connected: ${connectionId}`);

    ws.on('message', (message: string) => {
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
        } catch (error) {
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
function broadcastToRoom(roomId: string, senderWs: WebSocket, message: object) {
    const clients = rooms.get(roomId);
    if (clients) {
        const messageString = JSON.stringify(message);
        clients.forEach((client) => {
            if (client !== senderWs && client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    }
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'LiveTVGuessr API running with native WS!' });
});
app.use(passport.initialize());

// Mount the Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});