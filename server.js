const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
// This line requires the dependency you added to package.json
const fetch = require('node-fetch'); 

app.use(express.json());
app.use(express.static(__dirname));

// The Bridge: Your JS talks to this, and this talks to Gemini
app.post('/api/generate', async (req, res) =>
// --- Inside your route handler (e.g., app.post('/generate', ...) ) ---

console.log("Starting question generation..."); 
const startTime = Date.now(); // Start the timer

// This is where your AI call happens
const result = await model.generateContent(prompt); 

const endTime = Date.now(); // End the timer
console.log("AI responded in:", (endTime - startTime) / 1000, "seconds");

// --- Rest of your code ---{
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
        console.error(err);
        res.status(500).json({ error: "Failed to fetch from Gemini" });
    }
});

// Keep your existing socket logic here...
http.listen(process.env.PORT || 3000);