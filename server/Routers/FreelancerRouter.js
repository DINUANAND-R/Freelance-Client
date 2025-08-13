// routes/freelancerRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const Freelancer = require('../Modules/FreelancerModule');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/freelancers/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Register route
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, skills, github, linkedin, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const freelancer = new Freelancer({
      name,
      skills: JSON.parse(skills),
      github,
      linkedin,
      email,
      password: hashedPassword,
      profileImage: req.file ? req.file.filename : null,
    });

    await freelancer.save();
    res.status(201).json({ message: 'Freelancer registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register freelancer' });
  }
});

// Login route with loginHistory update
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const freelancer = await Freelancer.findOne({ email });
    if (!freelancer) {
      return res.status(400).json({ error: 'Freelancer not found' });
    }

    const isMatch = await bcrypt.compare(password, freelancer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update loginHistory - add today's date if not already present
    const today = new Date();
    const lastLogin = freelancer.loginHistory.length > 0 ? freelancer.loginHistory[freelancer.loginHistory.length - 1] : null;

    if (!lastLogin || new Date(lastLogin).toDateString() !== today.toDateString()) {
      freelancer.loginHistory.push(today);
      await freelancer.save();
    }

    res.status(200).json({
      message: 'Login successful',
      freelancer: {
        id: freelancer._id,
        name: freelancer.name,
        email: freelancer.email,
        profileImage: freelancer.profileImage,
        skills: freelancer.skills,
        github: freelancer.github,
        linkedin: freelancer.linkedin,
        loginHistory: freelancer.loginHistory, // send loginHistory to frontend
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get all freelancers
router.get('/all', async (req, res) => {
  try {
    const freelancers = await Freelancer.find({}, '-password'); // exclude passwords
    res.status(200).json(freelancers);
  } catch (error) {
    console.error('Error fetching freelancers:', error);
    res.status(500).json({ error: 'Failed to fetch freelancers' });
  }
});

// Get freelancer profile by email
router.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const freelancer = await Freelancer.findOne({ email });

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    res.json(freelancer);
  } catch (error) {
    console.error('Error fetching freelancer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete freelancer by email
router.delete('/delete/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const deletedFreelancer = await Freelancer.findOneAndDelete({ email });

    if (!deletedFreelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    res.json({ message: 'Freelancer deleted successfully', deletedFreelancer });
  } catch (error) {
    console.error('Error deleting freelancer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
