const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');
const nodemailer = require('nodemailer');

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// ===================== CREATE PROJECT =====================
router.post('/create', async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      title,
      description,
      deliverables,
      deadline,
      budget,
      references,
      ndaRequired
    } = req.body;

    // Count existing projects to create a unique ID
    const count = await Project.countDocuments();
    const projectId = `PID${count + 1}`;

    const newProject = new Project({
      clientName,
      clientEmail,
      title,
      description,
      deliverables,
      timeline: { deadline: new Date(deadline) },
      budget,
      references,
      ndaRequired,
      status: 'pending',
      projectId
    });

    await newProject.save();

    // Send confirmation email (non-blocking)
    transporter.sendMail({
      from: process.env.MAIL_USER,
      to: clientEmail,
      subject: 'Your project has been posted!',
      text: `Hello ${clientName},

        Your project "${title}" (ID: ${projectId}) has been successfully posted.

        Details:
        - Budget: ${budget}
        - Deadline: ${deadline}

        Thank you for using our service!
        `,
    }).then(() => {
      console.log(`📧 Email sent to ${clientEmail}`);
    }).catch((err) => {
      console.error('❌ Failed to send email:', err);
    });

    res.status(201).json({ message: '✅ Project posted successfully', project: newProject });
  } catch (error) {
    console.error('❌ Error posting project:', error);
    res.status(500).json({ error: 'Failed to post project', details: error.message });
  }
});

// ===================== GET ALL PROJECTS =====================
router.get('/all', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ===================== GET PROJECT BY Mongo _id =====================
router.get('/mongo/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('❌ Error fetching project by _id:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ===================== GET PROJECT BY Custom projectId =====================
router.get("/project/:projectId", async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== GET PROJECTS BY CLIENT EMAIL =====================
router.get('/client/:email', async (req, res) => {
  try {
    const projects = await Project.find({ clientEmail: req.params.email });
    res.status(200).json(projects);
  } catch (err) {
    console.error('❌ Error fetching client projects:', err);
    res.status(500).json({ error: 'Failed to fetch client projects' });
  }
});

// ===================== GET PROJECT STATUS COUNTS =====================
router.get('/project-status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const projects = await Project.find({ clientEmail: email });

    const counts = {
      completed: 0,
      accepted: 0,
      pending: 0,
    };

    projects.forEach((project) => {
      if (project.status.toLowerCase() === 'completed') counts.completed++;
      else if (project.status.toLowerCase() === 'accepted') counts.accepted++;
      else counts.pending++;
    });

    res.status(200).json(counts);
  } catch (err) {
    console.error('❌ Error getting project status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===================== GET RECENT PROJECTS =====================
router.get('/client/recent/:email', async (req, res) => {
  const clientEmail = req.params.email;

  try {
    const recentProjects = await Project.find({ clientEmail })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status budget timeline deadline deliverables createdAt')
      .lean();

    res.json(recentProjects);
  } catch (error) {
    console.error('Error fetching recent projects:', error);
    res.status(500).json({ message: 'Server error fetching recent projects' });
  }
});

// Example in Express.js
router.put('/by-project-id/:projectId/complete', async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOneAndUpdate(
      { projectId: projectId },
      { $set: { status: 'completed' } },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
