const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Serve your static files
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // --- ALL YOUR FEATURES GO INSIDE HERE ---

    // Feature: Create Private Room
    socket.on('createPrivateRoom', (data) => {
        socket.join(data.roomCode);
        console.log(`Room created: ${data.roomCode}`);
    });

    // Feature: Join Private Room
    socket.on('joinPrivateRoom', (data) => {
        socket.join(data.roomCode);
        console.log(`User joined room: ${data.roomCode}`);
    });

    // Add any other features (like game logic, chat, etc.) here
    // Just make sure they are inside these curly braces!

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Use the port provided by Render
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});