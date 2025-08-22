const express = require('express');
const router = express.Router();
const Project = require('../Modules/Project');
const ProjectRequest = require('../Modules/ProjectRequest');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Task = require('../Modules/TaskModule');


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
        const project = await Project.findOne({ projectId });
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
    const requestId = req.params.id; // Renamed for clarity

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        // Use findById() to find the document by its _id.
        // Mongoose automatically handles casting the string to a valid ObjectId.
        const request = await ProjectRequest.findById(requestId);
        
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

// 📌 GET: All projects for a freelancer (proposed or a team member)
router.get('/freelancer/all-projects/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Find projects where the freelancer either proposed or is a team member
        const projects = await ProjectRequest.find({
            $or: [
                { freelancerEmail: email },
                { "teamMeets.email": email }
            ]
        });

        if (!projects.length) {
            return res.status(404).json({ message: 'No projects found for this freelancer' });
        }

        res.json(projects);
    } catch (error) {
        console.error('Error fetching all freelancer projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/by-project-id/:projectId/complete', async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findOneAndUpdate(
            { projectId: projectId },
            { $set: { status: 'completed' } },
            { new: true }
        );
        const projectRequest = await ProjectRequest.findOneAndUpdate(
            { projectId: projectId },
            { $set: { status: 'completed' } },
            { new: true }
        );
        if (!project && !projectRequest) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Example in Express.js
router.put('/by-project-id/:projectId/status', async (req, res) => {
    const { projectId } = req.params;
    const { status } = req.body;

    try {
        const request = await ProjectRequest.findOneAndUpdate(
            { projectId: projectId },
            { $set: { status: status } },
            { new: true }
        );
        const project = await Project.findOneAndUpdate(
            { projectId: projectId },
            { $set: { status: status } },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: 'Project request not found' });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// 📌 GET: Project details + freelancer's request
router.get("/freelancer/project/:projectId", async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.query; // frontend must pass ?email=<freelancerEmail>

        if (!projectId || !email) {
            return res.status(400).json({ error: "Project ID and freelancer email are required" });
        }

        // Fetch the project by ID (make sure in DB projectId matches schema, could be _id or projectId field)
        const project = await Project.findOne({ projectId: projectId });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Fetch the freelancer's project request
        const projectRequest = await ProjectRequest.findOne({
            projectId: projectId,
            freelancerEmail: email,
        });

        if (!projectRequest) {
            return res.status(404).json({ error: "No request found for this freelancer on this project" });
        }

        // ✅ Return both project details + request details
        res.status(200).json({
            projectDetails: project,
            requestDetails: projectRequest,
        });
    } catch (err) {
        console.error("❌ Error fetching project details:", err);
        res.status(500).json({ error: "Server error while fetching project" });
    }
});
// Add freelancer to team (find using projectId + freelancerEmail in DB)
router.post('/add-to-team', async (req, res) => {
    try {
        const { projectId, freelancerEmail, newFreelancerEmail, newFreelancerName } = req.body;

        // Check if required fields are present
        if (!projectId || !freelancerEmail || !newFreelancerEmail || !newFreelancerName) {
            return res.status(400).json({ error: "projectId, freelancerEmail, newFreelancerEmail, and newFreelancerName are all required." });
        }

        // Find the ProjectRequest for the current freelancer
        const request = await ProjectRequest.findOne({ projectId, freelancerEmail });

        if (!request) {
            return res.status(404).json({ error: "ProjectRequest not found for this freelancer." });
        }

        // Check if the new freelancer's email already exists in the teamMeets array
        const isAlreadyInTeam = request.teamMeets.some(member => member.email === newFreelancerEmail);

        if (isAlreadyInTeam) {
            return res.status(400).json({ error: "Freelancer with this email is already in the team." });
        }
        
        // Create the new member object using data from the request body
        const newTeamMember = {
            email: newFreelancerEmail,
            name: newFreelancerName
        };

        // Push the new team member object into the teamMeets array
        request.teamMeets.push(newTeamMember);
        
        await request.save();

        res.status(200).json({
            message: "Freelancer added to team successfully",
            data: request
        });

    } catch (err) {
        console.error("Error adding freelancer to team:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/freelancer/project/team/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.query;

    console.log("Incoming request for team project details:", { projectId, email });

    // Find the main project details by its unique ID
    const project = await Project.findOne({ projectId });
    console.log("Project found:", project);


    // Find the specific project request that includes the freelancer in the teamMeets array
    const projectRequest = await ProjectRequest.findOne({
      projectId,
      "teamMeets.email": email
    });

    // Find all tasks associated with this project ID
    const tasks = await Task.find({ projectId });

    // Log the found data to the console for debugging
    console.log("Project Request found:", projectRequest);
    console.log("Tasks found:", tasks);

    // If no project is found, return a 404
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Send the combined data back to the frontend
    res.json({
      success: true,
      project,
      projectRequest,
      tasks
    });

  } catch (err) {
    console.error("Error fetching team project details:", err);
    res.status(500).json({ success: false, error: "An unexpected server error occurred." });
  }
});

module.exports = router;



module.exports = router;
