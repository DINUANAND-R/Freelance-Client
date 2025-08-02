const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  linkedin: { type: String },
  github: { type: String },
  profileImage: { type: String },
  role: { type: String, default: 'Freelancer' }, // ✅ Added role with default
}, { timestamps: true });

module.exports = mongoose.model('Freelancer', freelancerSchema);
