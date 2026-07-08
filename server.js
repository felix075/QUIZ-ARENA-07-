const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const fetch = require('node-fetch'); 

app.use(express.json());
app.use(express.static(__dirname));

// The Bridge: Your JS talks to this, and this talks to Gemini
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    
    // Debugging: Start timer
    console.log("Starting question generation..."); 
    const startTime = Date.now();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await response.json();
        
        // Debugging: Calculate and log duration
        const endTime = Date.now();
        console.log("AI responded in:", (endTime - startTime) / 1000, "seconds");
        
        res.json(data);
    } catch (err) {
        console.error("Error during generation:", err);
        res.status(500).json({ error: "Failed to fetch from Gemini" });
    }
});

// Keep your existing socket logic here...
http.listen(process.env.PORT || 3000);