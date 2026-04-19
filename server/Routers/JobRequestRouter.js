const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createJobRequest,
  getJobRequests,
  getJobRequestsByFreelancer,
  getRequestsByClientEmail,
  updateJobRequestStatus,
} = require("../Controllers/JobRequestController");

const router = express.Router();

// ✅ Ensure upload directory exists
const resumeUploadDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}

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

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// ✅ Routes
router.post("/create", upload.single("resume"), createJobRequest);
router.get("/", getJobRequests);
router.get("/freelancer/:email", getJobRequestsByFreelancer);
router.get("/client/:email", getRequestsByClientEmail);
router.put("/update/:id", updateJobRequestStatus);


module.exports = router;
