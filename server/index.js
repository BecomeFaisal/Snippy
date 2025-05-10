const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const CodeSession = require('./models/CodeSession');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your React app
    methods: ['GET', 'POST']
  }
});



io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ sessionId }) => {
    socket.join(sessionId); // Join a specific "room" for that session
    console.log(`User joined session ${sessionId}`);
  });

  socket.on('codeChange', async ({ sessionId, code }) => {
     console.log(`Saving code for session ${sessionId}`);
    // Send code to others in the same session
    socket.to(sessionId).emit('codeChange', code);

    // Save code to DB
    await CodeSession.updateOne(
  { sessionId },
  { code },
  { upsert: true }
);

  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


//Rest Apis
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ sessionId }) => {
    socket.join(sessionId); // Join a specific "room" for that session
    console.log(`User joined session ${sessionId}`);
  });

  socket.on('codeChange', async ({ sessionId, code }) => {
    // Send code to others in the same session
    socket.to(sessionId).emit('codeChange', code);

    // Save code to DB
    await CodeSession.updateOne({ sessionId }, { code });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


mongoose.connect('mongodb://localhost:27017/snippy').then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Create a new session
app.post('/api/create', async (req, res) => {
  const sessionId = Math.random().toString(36).substring(2, 8); // generates random 6-char ID
  const session = new CodeSession({ sessionId });
  await session.save();
  res.json({ sessionId });
});

// Get existing session by ID
app.get('/api/session/:id', async (req, res) => {
  const session = await CodeSession.findOne({ sessionId: req.params.id });
  if (!session) return res.status(404).send('Session not found');
  res.json({ code: session.code });
});
