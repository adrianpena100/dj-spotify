const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let sessions = {};

// Endpoint to create a new session
app.post('/api/session', (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = [];
  res.json({ sessionId });
});

// Endpoint to get guest messages for a session
app.get('/api/messages/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const messages = sessions[sessionId] || [];
  res.json(messages);
});

// Endpoint to post a new guest message
app.post('/api/messages/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const message = req.body.message;
  if (message) {
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }
    sessions[sessionId].push(message);
    res.status(201).json({ message: 'Message added successfully' });
  } else {
    res.status(400).json({ error: 'Message content is required' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});