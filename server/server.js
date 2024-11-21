require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const roomRoutes = require('./routes/roomRoutes');
const {nanoid} = require('nanoid');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Room = require('./models/Room');


const app = express();


// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error('Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }
  
  // Connect to MongoDB
  mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


//endpoint to create a room
app.post('/create-room', async (req, res) => {
    const { userID } = req.body;
    try {
        // Generate a unique room code
        let roomCode;
        let roomExists = true;
        while (roomExists) {
            roomCode = nanoid(6).toUpperCase(); // e.g., 'A1B2C3'
            const existingRoom = await Room.findOne({ roomCode });
            if (!existingRoom) {
                roomExists = false;
            }
        }

        // Create and save the new room
        const newRoom = new Room({
            roomCode,
            host: userId,
            participants: [],
        });

        await newRoom.save();

        res.json({ roomCode });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Server error' });
    }
    });

    //endpoint to join a room
app.post('/join-room', async (req, res) => {
    const { roomCode, userId } = req.body;

    try {
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if user is already a participant
        if (!room.participants.includes(userId) && room.host !== userId) {
            room.participants.push(userId);
            await room.save();
        }

        res.json({ success: true, roomCode: room.roomCode });
    } catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//endpoint to get room details: 
app.get('/room/:roomCode', async (req, res) => {
    const { roomCode } = req.params;

    try {
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({
            roomCode: room.roomCode,
            host: room.host,
            participants: room.participants,
            createdAt: room.createdAt,
        });
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Routes
app.use('/api/rooms', roomRoutes);

