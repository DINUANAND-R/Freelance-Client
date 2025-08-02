// routes/projectRequests.js
const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');
const ProjectRequest = require('../Modules/ProjectRequest');

router.post('/send', async (req, res) => {
  const {projectTitle, projectId, freelancerEmail, proposalMessage, clientEmail } = req.body;

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
      proposalMessage
    });

    await newRequest.save();

    res.status(200).json({ message: 'Request sent successfully' });
  } catch (err) {
    console.error('❌ Error in request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

    router.get('/client/:email', async (req, res) => {
    try {
        const requests = await ProjectRequest.find({ clientEmail: req.params.email });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
    });

module.exports = router;
