const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FreelancerPost = require('../Modules/FreelancerPost');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'freelancerPosts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📂 Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📌 POST: Create new freelancer post
router.post('/create', upload.single('file'), async (req, res) => {
  try {
    // Correctly destructure name and email from req.body
    const { name, email, title, description } = req.body;

    // Check for the correct variables in the validation
    if (!name || !email || !title) {
      return res.status(400).json({ message: 'Name, email, and title are required' });
    }

    // Use the correct variables to create the new post
    const newPost = new FreelancerPost({
      freelancerName: name, // Map the 'name' from req.body to 'freelancerName' in the schema
      freelancerEmail: email, // Map the 'email' from req.body to 'freelancerEmail' in the schema
      title,
      description,
      file: req.file ? `/uploads/freelancerPosts/${req.file.filename}` : null
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 GET: Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await FreelancerPost.find().sort({ postedAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 📌 GET: Get posts by freelancer email (path param version)
router.get('/freelancerPosts/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    let posts = await FreelancerPost.find({ freelancerEmail: email }).sort({ postedAt: -1 });

    // Convert file path to full URL
    posts = posts.map(post => ({
      ...post._doc,
      file: post.file ? `${req.protocol}://${req.get('host')}${post.file}` : null
    }));

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this email' });
    }

    res.json(posts);
  } catch (err) {
    console.error('Error fetching freelancer posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
