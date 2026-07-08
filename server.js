// Add these events to your existing server.js inside io.on('connection', ...)

// Create a private room
socket.on('createPrivateRoom', (data) => {
    socket.join(data.roomCode); // User joins the unique room
    console.log(`User ${data.username} created private room: ${data.roomCode}`);
});

// Join a private room
socket.on('joinPrivateRoom', (data) => {
    // Check if the room exists before letting the user join
    const room = io.sockets.adapter.rooms.get(data.roomCode);
    
    if (room) {
        socket.join(data.roomCode); // Add user to the existing room
        console.log(`User ${data.username} joined private room: ${data.roomCode}`);
        
        // Notify both players in the room that the match can start
        io.to(data.roomCode).emit('matchFound', { 
            message: "Private match started!", 
            roomId: data.roomCode 
        });
    } else {
        // Send an error back to the client if the room code is invalid
        socket.emit('error', { message: "Room not found. Please check the code." });
    }
});