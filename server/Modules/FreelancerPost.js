// Modules/FreelancerPost.js
const mongoose = require('mongoose');

const FreelancerPostSchema = new mongoose.Schema(
  {
    freelancerName: { type: String, required: true, trim: true },
    freelancerEmail: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    file: { type: String }, // file path or URL
    postedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FreelancerPost', FreelancerPostSchema);
