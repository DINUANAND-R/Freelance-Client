const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createJobRequest,
  getJobRequests,
  getJobRequestsByFreelancer,
  getRequestsByClientEmail,
  updateJobRequestStatus,
} = require("../Controllers/JobRequestController");

const router = express.Router();

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes/"); // Folder for resumes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post("/create", upload.single("resume"), createJobRequest);
router.get("/", getJobRequests);
router.get("/freelancer/:email", getJobRequestsByFreelancer);
router.get("/client/:email", getRequestsByClientEmail);
router.put("/update/:id", updateJobRequestStatus);


module.exports = router;
