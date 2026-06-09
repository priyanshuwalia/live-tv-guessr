// test-ws.js
const WebSocket = require('ws');

console.log('🧪 Starting WebSocket Room Test...');

// CHANGE: Point these to 8080!
const player1 = new WebSocket('ws://localhost:8080');
const player2 = new WebSocket('ws://localhost:8080');

const ROOM_ID = 'lobby-777';

player1.on('open', () => {
    console.log('🟢 Player 1 connected');
    player1.send(JSON.stringify({
        type: 'join_room',
        roomId: ROOM_ID,
        payload: {}
    }));
});

player2.on('open', () => {
    console.log('🟢 Player 2 connected');
    setTimeout(() => {
        player2.send(JSON.stringify({
            type: 'join_room',
            roomId: ROOM_ID,
            payload: {}
        }));
    }, 500);
});

player1.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log(`📥 Player 1 received:`, msg);
    
    if (msg.type === 'player_joined') {
        console.log('✅ TEST PASSED: Room broadcasting works!');
        process.exit(0);
    }
});