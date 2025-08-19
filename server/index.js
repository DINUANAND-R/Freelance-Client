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
const server = http.createServer(app);

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://freelance-client-hazel.vercel.app"
];

// ✅ Socket.IO with multiple origins
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;

// ✅ Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/freelancerPosts', express.static(path.join(__dirname, 'uploads', 'freelancerPosts')));

// ✅ Routes
const clientRoutes = require('./Routers/ClientRouter');
app.use('/api/client', clientRoutes);

const freelancerRoutes = require('./Routers/FreelancerRouter');
app.use('/api/freelancers', freelancerRoutes);

const messageRoutes = require('./Routers/MessageRouter');
app.use('/api/messages', messageRoutes);

const projectRoutes = require('./Routers/ProjectRouter');
app.use('/api/projects', projectRoutes);

const projectRequestRouter = require('./Routers/ProjectRequestRouter');
app.use('/api/project-requests', projectRequestRouter);

const adminRouter = require('./Routers/AdminRouter');
app.use('/api/admin', adminRouter);

const adminLogin = require('./Routers/AdminLoginRouter');
app.use('/admin', adminLogin);

const email = require('./Routers/EmailRouter');
app.use('/api/email', email);

const freelancerPost = require('./Routers/FreelancerPostRouter');
app.use('/api/post', freelancerPost);

const RatingRouter = require('./Routers/RatingRouter');
app.use('/api/rating', RatingRouter);

const Job = require('./Routers/JobRouter');
app.use('/api/job', Job);

const JobRequest = require('./Routers/JobRequestRouter');
app.use('/api/jobRequest', JobRequest);

// ✅ Socket.IO real-time messaging
io.on('connection', (socket) => {
  console.log('📡 New user connected:', socket.id);

  socket.on('join', (email) => {
    socket.join(email); // Join room using email
    console.log(`📥 User joined room: ${email}`);
  });

  socket.on('sendMessage', async ({ senderEmail, receiverEmail, messageText }) => {
    if (!senderEmail || !receiverEmail || !messageText?.trim()) {
      console.warn('⚠️ Skipping empty or malformed message');
      return;
    }

    try {
      const newMessage = new Message({ senderEmail, receiverEmail, messageText });
      await newMessage.save();

      io.to(receiverEmail).emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('❌ Failed to save/send message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// ✅ MongoDB Connection
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
