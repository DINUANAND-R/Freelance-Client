const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByEmail,
} = require("../Controllers/JobController");

// Routes
router.post("/create", createJob);       // Create Job
router.get("/", getJobs);          // Get All Jobs
router.get("/:id", getJobById);    // Get Job by ID
router.put("/:id", updateJob);     // Update Job
router.delete("/:id", deleteJob);
router.get("/getByEmail/:email",getJobsByEmail);// Delete Job

module.exports = router;
