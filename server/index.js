const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const CodeSession = require('./models/CodeSession');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://snippy-git-main-becomefaisals-projects.vercel.app',
    'https://snippy-five.vercel.app'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://snippy-git-main-becomefaisals-projects.vercel.app',
      'https://snippy-five.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('join', ({ sessionId }) => {
    socket.join(sessionId); // Join a specific "room" for that session
  });

  socket.on('codeChange', async ({ sessionId, code }) => {
    socket.to(sessionId).emit('codeChange', code);
    await CodeSession.updateOne(
      { sessionId },
      { code },
      { upsert: true }
    );
  });

  socket.on('disconnect', () => {
  });
});

//Rest Apis
io.on('connection', (socket) => {
  socket.on('join', ({ sessionId }) => {
    socket.join(sessionId); // Join a specific "room" for that session
  });

  socket.on('codeChange', async ({ sessionId, code }) => {
    socket.to(sessionId).emit('codeChange', code);
    await CodeSession.updateOne(
      { sessionId },
      { code },
      { upsert: true }
    );
  });

  socket.on('disconnect', () => {
  });
});

mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API routes
app.post('/api/create', async (req, res) => {
  const sessionId = Math.random().toString(36).substring(2, 8); // generates random 6-char ID
  const session = new CodeSession({ sessionId });
  await session.save();
  res.json({ sessionId });
});

app.get('/api/session/:id', async (req, res) => {
  const session = await CodeSession.findOne({ sessionId: req.params.id });
  if (!session) return res.status(404).send('Session not found');
  res.json({ code: session.code });
});



const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));s
