const RoomCode = require('../models/RoomCode');

// Function to generate a random 6-character room code
const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Function to create and store a new room code
const createRoomCode = async (hostId) => {
    const roomCode = generateRoomCode();

    // Ensure the room code is unique
    const existingCode = await RoomCode.findOne({ roomCode });
    if (existingCode) {
        return createRoomCode(hostId); // Retry if duplicate
    }

    const newRoomCode = new RoomCode({ roomCode, hostId });
    await newRoomCode.save();
    return roomCode;
};

module.exports = { createRoomCode };
