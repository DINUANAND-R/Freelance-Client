// src/routes/tasks.js (or integrated into your project-requests route file)
const express = require('express');
const router = express.Router();
const ProjectRequest = require('../Modules/ProjectRequest'); // Make sure this path is correct
const Task = require('../Modules/TaskModule'); // Import the new Task model

/**
 * Endpoint to assign a new task to a freelancer on a project team.
 * This now creates a new document in the "tasks" collection.
 * POST /api/tasks/assign
 *
 * Request Body:
 * {
 * "projectId": "string",
 * "leaderEmail": "string",
 * "leaderName": "string",
 * "freelancerEmail": "string",
 * "freelancerName": "string",
 * "task": "string"
 * }
 */
router.post('/assign', async (req, res) => {
  try {
    const { 
      projectId, 
      leaderEmail, 
      leaderName, 
      freelancerEmail, 
      freelancerName,
      task
    } = req.body;

    // 1. Basic input validation
    if (!projectId || !leaderEmail || !leaderName || !freelancerEmail || !freelancerName || !task) {
      return res.status(400).json({ error: "All fields are required to assign a task." });
    }

    // 2. Find the project request document to validate the team member
    const projectRequest = await ProjectRequest.findOne({ projectId });
    if (!projectRequest) {
      return res.status(404).json({ error: "Project request not found." });
    }

    // 3. Ensure the team member exists in the project's team
    const teamMemberExists = projectRequest.teamMeets.some(member => member.email === freelancerEmail);
    if (!teamMemberExists) {
        return res.status(400).json({ error: "The selected freelancer is not a member of this project team." });
    }
    
    // 4. Create a new task document in the Task collection
    const newTask = new Task({
      projectId,
      leaderEmail,
      leaderName,
      freelancerEmail,
      freelancerName,
      task,
      status: 'pending'
    });
    
    // 5. Save the new task document to the database
    console.log(projectId)
    await newTask.save();

    // 6. Send back the newly created task
    res.status(201).json({ 
      message: "Task assigned successfully.",
      data: newTask 
    });

  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to get all tasks for a specific project.
 * GET /api/tasks/:projectId
 */
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Find all tasks that belong to the given projectId.
    const tasks = await Task.find({ projectId });

    if (!tasks) {
      return res.status(404).json({ message: "No tasks found for this project." });
    }

    res.status(200).json(tasks);

  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/freelancer/task/complete', async (req, res) => {
  try {
    // Correctly get the data from the request body
    // The keys here (projectId, taskTitle, freelancerEmail) must match the frontend payload
    const { projectId, taskTitle, freelancerEmail } = req.body;
    
    console.log("Attempting to mark task as completed:", { projectId, taskTitle, freelancerEmail });

    // Find the task by its unique fields and update the isCompleted status
    const updatedTask = await Task.findOneAndUpdate(
      { 
        projectId: projectId, 
        task: taskTitle, 
        freelancerEmail: freelancerEmail 
      },
      { $set:{status:"completed"}},
      { new: true } // Return the updated document after the operation
    );

    // If no task was found with these details, send a 404 response
    if (!updatedTask) {
      console.log("Task not found with the provided details.");
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    
    console.log("Task successfully updated:", updatedTask);

    // Send a success message back to the frontend
    res.json({ success: true, message: "Task marked as completed successfully." });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ success: false, error: "An unexpected server error occurred." });
  }
});

module.exports = router;
