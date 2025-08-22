const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const Message = require('./Modules/Message'); // Adjust model path if needed

dotenv.config();

const app = express();
const server = http.createServer(app);
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
app.use(express.urlencoded({ extended: true }));

// --- File Uploads with Multer ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadsDir)) {
    require('fs').mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// API Endpoint for File Uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    const { senderEmail, receiverEmail } = req.body;
    
    if (!senderEmail || !receiverEmail) {
        return res.status(400).send('Sender and receiver emails are required.');
    }

    try {
        const fileUrl = `/uploads/${req.file.filename}`;
        
        const newFileMessage = new Message({
            senderEmail: senderEmail,
            receiverEmail: receiverEmail,
            fileUrl: fileUrl,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            type: 'file',
            timestamp: new Date(),
        });
        
        await newFileMessage.save();
        
        io.to(senderEmail).emit('receiveFileMessage', newFileMessage);
        io.to(receiverEmail).emit('receiveFileMessage', newFileMessage);

        res.status(200).json({ success: true, message: "File uploaded and message saved." });

    } catch (err) {
        console.error('❌ Failed to save file message:', err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads/freelancerPosts', express.static(path.join(__dirname, 'uploads', 'freelancerPosts')));

// Routes
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

// Socket.IO real-time messaging
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
        if (!msg.senderEmail || !msg.receiverEmail || !msg.messageText?.trim()) {
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

    socket.on('call-request', ({ targetUserEmail, callerEmail }) => {
        const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
        if (targetSocketId) {
            io.to(targetSocketId).emit('call-incoming', { callerEmail });
        }
    });

    socket.on('call-accepted', ({ targetUserEmail }) => {
        const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
        if (targetSocketId) {
            io.to(targetSocketId).emit('call-accepted');
        }
    });

    socket.on('call-declined', ({ targetUserEmail }) => {
        const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
        if (targetSocketId) {
            io.to(targetSocketId).emit('call-declined');
        }
    });
    
    socket.on('call-user', ({ targetUserEmail, signal, callerEmail }) => {
        const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
        if (targetSocketId) {
            io.to(targetSocketId).emit('call-made', {
                signal,
                callerEmail
            });
        }
    });

    socket.on('make-answer', ({ signal, to }) => {
        const targetSocketId = emailToSocketIdMap.get(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('answer-made', {
                signal,
                answererEmail: to
            });
        }
    });

    socket.on('ice-candidate', ({ targetUserEmail, candidate }) => {
        const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
        if (targetSocketId) {
            io.to(targetSocketId).emit('ice-candidate', {
                candidate,
            });
        }
    });

    socket.on('end-call', ({ targetUserEmail }) => {
        const targetSocketId = emailToSocketIdMap.get(targetUserEmail);
        if (targetSocketId) {
            io.to(targetSocketId).emit('end-call');
        }
    });

    socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
        let userEmail = null;
        for (let [email, id] of emailToSocketIdMap.entries()) {
            if (id === socket.id) {
                userEmail = email;
                emailToSocketIdMap.delete(email);
                console.log(`User ${email} unregistered.`);
                break;
            }
        }
        if (userEmail) {
            socket.broadcast.emit('userStatus', { email: userEmail, isOnline: false });
        }
    });
});

// MongoDB Connection
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('✅ MongoDB Connected');
        server.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });