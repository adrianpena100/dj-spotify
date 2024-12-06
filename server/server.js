const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  })); // Enable CORS for all origins (adjust in production)
app.use(express.json());

// In-memory store for song requests (use a database in production)
let songRequests = [];

// POST route to receive song requests
app.post('/request-song', (req, res) => {
    const { songName } = req.body;
    if (!songName || songName.trim() === "") {
        return res.status(400).json({ message: "Song name is required." });
    }

    // Add timestamp or unique ID if needed
    const newRequest = {
        id: songRequests.length + 1,
        songName: songName.trim(),
        timestamp: new Date(),
        handled: false
    };

    songRequests.push(newRequest);
    console.log("New song request:", newRequest);
    return res.status(200).json({ message: "Song request received." });
});

// GET route for the host to fetch all song requests
app.get('/requests', (req, res) => {
    return res.status(200).json(songRequests);
});

// POST route to mark a request as handled or to clear requests
app.post('/requests/clear', (req, res) => {
    songRequests = [];
    return res.status(200).json({ message: "All requests have been cleared." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
