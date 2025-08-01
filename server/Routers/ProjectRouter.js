const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');

// Create a new project
router.post('/create', async (req, res) => {
  try {
    const {
      clientEmail,
      title,
      description,
      deliverables,
      deadline,
      budget,
      references,
      ndaRequired
    } = req.body;

    const newProject = new Project({
      clientEmail,
      title,
      description,
      deliverables,
      timeline: { deadline: new Date(deadline) },  // Fix here
      budget,
      references,
      ndaRequired
    });

    await newProject.save();
    res.status(201).json({ message: 'Project posted successfully', project: newProject });
  } catch (error) {
    console.error('❌ Error posting project:', error);
    res.status(500).json({ error: 'Failed to post project', details: error.message });
  }
});


// Get all projects
router.get('/all', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

module.exports = router;
