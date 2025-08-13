// routes/projectRequests.js
const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');
const ProjectRequest = require('../Modules/ProjectRequest');
const nodemailer = require('nodemailer');

// 📧 Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// 📌 POST: Send a project request
router.post('/send', async (req, res) => {
  const { projectTitle, projectId, freelancerEmail, proposalMessage, clientEmail, freelancerName } = req.body;

  if (!projectId || !freelancerEmail || !clientEmail) {
    return res.status(400).json({ error: 'projectId, freelancerEmail, and clientEmail are required' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const existingRequest = await ProjectRequest.findOne({ projectId, freelancerEmail });
    if (existingRequest) {
      return res.status(409).json({ error: 'Request already sent for this project' });
    }

    const newRequest = new ProjectRequest({
      projectTitle,
      projectId,
      clientEmail,
      freelancerEmail,
      proposalMessage,
      freelancerName
    });

    await newRequest.save();

    // Send email to client
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: clientEmail,
        subject: `New Project Request for "${projectTitle}"`,
        html: `
          <h2>New Project Request</h2>
          <p><strong>Freelancer:</strong> ${freelancerName} (${freelancerEmail})</p>
          <p><strong>Project:</strong> ${projectTitle}</p>
          <p><strong>Message:</strong></p>
          <p>${proposalMessage}</p>
        `
      });
      console.log(`📧 Email sent to ${clientEmail}`);
    } catch (mailErr) {
      console.error('❌ Failed to send email:', mailErr);
    }

    res.status(200).json({ message: 'Request sent successfully' });
  } catch (err) {
    console.error('❌ Error in request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 GET: All requests for a client
router.get('/client/:email', async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ clientEmail: req.params.email });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 PUT: Update status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['accepted', 'denied'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const request = await ProjectRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = status;
    await request.save();

    // Optional: also update Project table if needed
    if (status === 'accepted') {
      await Project.findByIdAndUpdate(request.projectId, { status }, { new: true });
    }

    res.status(200).json({ message: `Request ${status} successfully.`, request });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ error: 'Server error while updating status' });
  }
});

// 📌 GET: All requests for a freelancer
router.get('/freelancer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await ProjectRequest.find({ freelancerEmail: email });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching freelancer requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 GET: All ACCEPTED projects for a freelancer
// 📌 GET: All ACCEPTED projects for a freelancer with full project details
router.get('/freelancer/projects/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Step 1: Fetch accepted requests for this freelancer
    const requests = await ProjectRequest.find({
      freelancerEmail: email,
      status: 'accepted'
    });

    if (!requests.length) {
      return res.status(404).json({ message: 'No accepted projects found for this freelancer' });
    }

    // Step 2: Extract all project IDs
    const projectIds = requests.map(req => req.projectId);

    // Step 3: Fetch projects from Project collection
    const projects = await Project.find({ _id: { $in: projectIds } });

    // Step 4: Merge project details with request data
    const mergedResults = requests.map(req => {
      const project = projects.find(p => p._id.toString() === req.projectId.toString());
      return {
        ...req.toObject(),
        projectDetails: project || null
      };
    });

    res.status(200).json(mergedResults);
  } catch (error) {
    console.error('Error fetching freelancer projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
