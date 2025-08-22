// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');

// Models
const Message = require('./Modules/Message'); // make sure path is correct

// --- Config ---
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;

// Default + ENV allowed origins
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://freelance-client-hazel.vercel.app',
];
const envOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

// --- Middleware ---
app.set('trust proxy', 1);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight support

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Socket.IO ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// --- File Uploads ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadsDir));
app.use(
  '/uploads/freelancerPosts',
  express.static(path.join(__dirname, 'uploads', 'freelancerPosts'))
);

// --- Health / Debug routes ---
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    allowedOrigins,
  });
});

// --- Routers ---
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

const TaskRouter = require('./Routers/TaskRouter');
app.use('/api/tasks', TaskRouter);

// --- Upload API ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const { senderEmail, receiverEmail } = req.body;
  if (!senderEmail || !receiverEmail) {
    return res.status(400).send('Sender and receiver emails are required.');
  }

  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const newFileMessage = new Message({
      senderEmail,
      receiverEmail,
      fileUrl,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      type: 'file',
      timestamp: new Date(),
    });

    await newFileMessage.save();

    io.to(senderEmail).emit('receiveFileMessage', newFileMessage);
    io.to(receiverEmail).emit('receiveFileMessage', newFileMessage);

    res
      .status(200)
      .json({ success: true, message: 'File uploaded and message saved.' });
  } catch (err) {
    console.error('❌ Failed to save file message:', err);
    res
      .status(500)
      .json({ success: false, message: 'Internal server error.' });
  }
});

// --- Socket.IO events ---
const emailToSocketIdMap = new Map();

io.on('connection', (socket) => {
  console.log('📡 New user connected:', socket.id);

  socket.on('register-user', (userEmail) => {
    emailToSocketIdMap.set(userEmail, socket.id);
    console.log(`User ${userEmail} registered with socket ID: ${socket.id}`);
    socket.broadcast.emit('userStatus', { email: userEmail, isOnline: true });
  });

  socket.on('checkUserStatus', (emailToCheck) => {
    const isOnline = emailToSocketIdMap.has(emailToCheck);
    socket.emit('userStatus', { email: emailToCheck, isOnline });
  });

  socket.on('join', (email) => {
    socket.join(email);
    console.log(`📥 User joined room: ${email}`);
  });

  socket.on('sendMessage', async (msg) => {
    if (!msg?.senderEmail || !msg?.receiverEmail || !msg?.messageText?.trim()) {
      console.warn('⚠️ Skipping empty or malformed message');
      return;
    }
    try {
      const newMessage = new Message({
        senderEmail: msg.senderEmail,
        receiverEmail: msg.receiverEmail,
        messageText: msg.messageText,
        type: 'text',
        timestamp: new Date(),
      });
      await newMessage.save();

      io.to(msg.receiverEmail).emit('receiveMessage', newMessage);
      io.to(msg.senderEmail).emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('❌ Failed to save/send message:', err.message);
    }
  });

  // --- Simple call signaling ---
  socket.on('call-request', ({ targetUserEmail, callerEmail }) => {
    const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
    if (targetSocketId)
      io.to(targetSocketId).emit('call-incoming', { callerEmail });
  });

  socket.on('call-accepted', ({ targetUserEmail }) => {
    const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
    if (targetSocketId) io.to(targetSocketId).emit('call-accepted');
  });

  socket.on('call-declined', ({ targetUserEmail }) => {
    const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
    if (targetSocketId) io.to(targetSocketId).emit('call-declined');
  });

  socket.on('call-user', ({ targetUserEmail, signal, callerEmail }) => {
    const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
    if (targetSocketId)
      io
        .to(targetSocketId)
        .emit('call-made', { signal, callerEmail });
  });

  socket.on('make-answer', ({ signal, to }) => {
    const targetSocketId = emailToSocketIdMap.get(to);
    if (targetSocketId)
      io
        .to(targetSocketId)
        .emit('answer-made', { signal, answererEmail: to });
  });

  socket.on('ice-candidate', ({ targetUserEmail, candidate }) => {
    const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
    if (targetSocketId)
      io.to(targetSocketId).emit('ice-candidate', { candidate });
  });

  socket.on('end-call', ({ targetUserEmail }) => {
    const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
    if (targetSocketId) io.to(targetSocketId).emit('end-call');
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
    let userEmail = null;
    for (const [email, id] of emailToSocketIdMap.entries()) {
      if (id === socket.id) {
        userEmail = email;
        emailToSocketIdMap.delete(email);
        console.log(`User ${email} unregistered.`);
        break;
      }
    }
    if (userEmail) {
      socket.broadcast.emit('userStatus', {
        email: userEmail,
        isOnline: false,
      });
    }
  });
});

// --- Mongo Connection + Start ---
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// --- Error handler ---
app.use((err, req, res, next) => {
  if (err?.message?.startsWith('Not allowed by CORS')) {
    return res
      .status(403)
      .json({ error: 'CORS blocked', originTried: req.headers.origin });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
