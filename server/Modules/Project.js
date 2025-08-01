const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  clientEmail: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  deliverables: { type: String, required: true },
  timeline: {
    deadline: { type: Date, required: true }
  },
  budget: { type: Number, required: true },
  references: { type: String },
  ndaRequired: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
