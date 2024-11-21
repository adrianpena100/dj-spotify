const express = require('express');
const router = express.Router();
const { createRoomCode } = require('../controllers/roomController');

// POST route to generate a room code
router.post('/generate', async (req, res) => {
    const { hostId } = req.body;

    if (!hostId) {
        return res.status(400).json({ error: 'Host ID is required.' });
    }

    try {
        const roomCode = await createRoomCode(hostId);
        res.status(201).json({ roomCode });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate room code.' });
    }
});

module.exports = router;
