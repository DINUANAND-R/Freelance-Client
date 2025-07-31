const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');

// POST - Create new project
router.post('/create', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

module.exports = router;
