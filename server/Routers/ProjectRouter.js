const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');


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

    // Count existing documents to create a unique Project ID
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
    res.status(201).json({ message: '✅ Project posted successfully', project: newProject });
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
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('❌ Error fetching project by ID:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// GET projects by client email
router.get('/client/:email', async (req, res) => {
  try {
    const projects = await Project.find({ clientEmail: req.params.email });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch client projects' });
  }
});


module.exports = router;
