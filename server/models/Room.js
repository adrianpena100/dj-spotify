// models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    host: {
        type: String, // You can reference a User model if you have one
        required: true,
    },
    participants: {
        type: [String], // Array of user IDs
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h', // Optional: Automatically delete rooms after 24 hours
    },
});

module.exports = mongoose.model('Room', RoomSchema);
