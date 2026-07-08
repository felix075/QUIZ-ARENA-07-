const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

app.use(express.static(__dirname));

let queue = [];
let scores = {};

io.on('connection', (socket) => {
    socket.on('findRandom', () => {
        if(queue.length > 0) {
            let opponent = queue.shift();
            let room = "rnd_" + socket.id;
            socket.join(room); opponent.join(room);
            io.to(room).emit('startGame', room);
        } else { queue.push(socket); }
    });

    socket.on('joinRoom', (code) => { socket.join(code); io.to(code).emit('startGame', code); });
    socket.on('submitScore', (d) => {
        scores[d.room] = scores[d.room] || [];
        scores[d.room].push({id: socket.id, score: d.score});
        if(scores[d.room].length === 2) {
            let winner = scores[d.room][0].score > scores[d.room][1].score ? "Player 1" : "Player 2";
            io.to(d.room).emit('winner', winner);
        }
    });
});
http.listen(process.env.PORT || 3000);