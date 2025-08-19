const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    ClientName : { type: String, required: true },
    FreelancerName : { type: String, required: true },
    ClientEmail : { type: String, required: true },
    FreelancerEmail : { type: String, required: true },
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    jobType: {
      type: String, required: true,
    },
    resume: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    jobId:{ type: String, required: true },
    status:{ type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model("JobRequest", jobSchema);
