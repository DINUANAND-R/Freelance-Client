const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
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
  status: { type: String, default: 'pending' }, // ✅ Added status
  createdAt: { type: Date, default: Date.now },
  projectId: { type: String, required: true },
});

module.exports = mongoose.model('Project', projectSchema);
