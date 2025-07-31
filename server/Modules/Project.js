const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  skills: String,
  budget: Number,
  deadline: String,
  clientEmail: String,
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
