// routes/projectRequests.js
const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');
const ProjectRequest = require('../Modules/ProjectRequest');

// POST: Send a project request
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

    res.status(200).json({ message: 'Request sent successfully' });
  } catch (err) {
    console.error('❌ Error in request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Get all requests for a client by email
router.get('/client/:email', async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ clientEmail: req.params.email });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// ✅ PUT: Update status (accepted/denied) for a project request
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

    // Update the status of the project request
    request.status = status;
    await request.save();

    // Reflect status in the related project
    await Project.findByIdAndUpdate(
      request.projectId,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: `Request ${status} successfully.`,
      request,
    });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ error: 'Server error while updating status' });
  }
});

module.exports = router;
