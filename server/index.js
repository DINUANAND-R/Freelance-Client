const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./Modules/Message'); // Adjust model path if needed

dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap app in HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const clientRoutes = require('./Routers/ClientRouter');
app.use('/api/client', clientRoutes);

const freelancerRoutes = require('./Routers/FreelancerRouter');
app.use('/api/freelancers', freelancerRoutes);

const messageRoutes = require('./Routers/MessageRouter');
app.use('/api/messages', messageRoutes);

// Socket.IO real-time messaging
io.on('connection', (socket) => {
  console.log('📡 New user connected:', socket.id);

  socket.on('join', (email) => {
    socket.join(email); // Join room using email
    console.log(`📥 User joined room: ${email}`);
  });

  socket.on('sendMessage', async ({ senderEmail, receiverEmail, messageText }) => {
    try {
      const newMessage = new Message({ senderEmail, receiverEmail, messageText });
      await newMessage.save();

      // Send message to receiver room
      io.to(receiverEmail).emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('❌ Failed to save/send message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// MongoDB Connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected');
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
