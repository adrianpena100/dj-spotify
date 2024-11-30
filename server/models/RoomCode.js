const mongoose = require('mongoose');

const roomCodeSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true
    },
    hostId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Optional: Room codes expire after 1 hour
    }
});

module.exports = mongoose.model('RoomCode', roomCodeSchema);
