const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      required: true,
    },
    salaryRange: { type: String, required: false },
    description: { type: String, required: true },
    requirements: { type: [String], required: true }, // array of strings
    applicationDeadline: { type: Date, required: true },
    contactEmail: { type: String, required: true },
    postedBy: { type: String, required: true }, // client email or ID

    // ✅ New field added
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
