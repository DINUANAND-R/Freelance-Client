const express = require('express');
const router = express.Router();

const Freelancer = require('../Modules/FreelancerModule'); // Adjust the path if different
const Client = require('../Modules/ClientModule');
const Project = require('../Modules/Project'); // Assuming you have this model

// Get all freelancers
router.get('/freelancers', async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.status(200).json(freelancers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch freelancers' });
  }
});

// Get all clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

module.exports = router;
