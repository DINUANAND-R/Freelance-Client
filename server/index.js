const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const clientRoutes = require('./Routers/ClientRouter'); // match folder and file name
app.use('/api/client', clientRoutes);

const freelancerRoutes = require('./Routers/FreelancerRouter'); // correct path
app.use('/api/freelancers', freelancerRoutes); // plural form

const messageRoutes = require('./Routers/MessageRouter');
app.use('/api/messages', messageRoutes);


// MongoDB Connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
