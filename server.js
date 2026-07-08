const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const fetch = require('node-fetch'); // Make sure to run: npm install node-fetch

app.use(express.json()); // Essential to read the prompt from your game
app.use(express.static(__dirname));

// The Secure Proxy Route
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).send("Error generating questions");
    }
});

// ... Keep your existing socket.io code here ...
http.listen(process.env.PORT || 3000);