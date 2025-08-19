const JobRequest = require("../Modules/JobRequest");

// ✅ Create Job Request
exports.createJobRequest = async (req, res) => {
  try {
    const {
      ClientName,
      FreelancerName,
      ClientEmail,
      FreelancerEmail,
      title,
      companyName,
      jobType,
      jobId,
      status,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const jobRequest = new JobRequest({
      ClientName,
      FreelancerName,
      ClientEmail,
      FreelancerEmail,
      title,
      companyName,
      jobType,
      resume: req.file.filename,
      jobId,
      status,
    });

    await jobRequest.save();
    res.status(201).json({ message: "Job Request Sent Successfully", jobRequest });
  } catch (err) {
    console.error("Error creating job request:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// ✅ Get All Job Requests
exports.getJobRequests = async (req, res) => {
  try {
    const requests = await JobRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job requests", error });
  }
};

// ✅ Get Job Requests by Freelancer Email
exports.getJobRequestsByFreelancer = async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await JobRequest.find({ FreelancerEmail: email });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job requests", error });
  }
};


exports.getRequestsByClientEmail = async (req, res) => {
  try {
    const { email } = req.params; // ✅ Fix: use "email", not "clientEmail"

    if (!email) {
      return res.status(400).json({ message: "Client email is required" });
    }

    const jobRequests = await JobRequest.find({ ClientEmail: email });

    res.status(200).json(jobRequests);
  } catch (error) {
    console.error("Error fetching job requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update request status
exports.updateJobRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRequest = await JobRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

