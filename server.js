const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname));

let matchmakingQueue = [];

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // Global Matchmaking
    socket.on('findOnline', () => {
        if (matchmakingQueue.length > 0) {
            let opponent = matchmakingQueue.shift();
            let roomId = "room_" + socket.id;
            socket.join(roomId);
            opponent.join(roomId);
            io.to(roomId).emit('matchFound', { roomId });
        } else {
            matchmakingQueue.push(socket);
        }
    });

    socket.on('createPrivateRoom', (data) => { socket.join(data.roomCode); });
    socket.on('joinPrivateRoom', (data) => { socket.join(data.roomCode); });

    socket.on('disconnect', () => {
        matchmakingQueue = matchmakingQueue.filter(s => s.id !== socket.id);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on ${port}`));