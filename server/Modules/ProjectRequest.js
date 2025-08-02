// models/ProjectRequest.js
const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema({
  freelancerName: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  freelancerEmail: {
    type: String,
    required: true,
  },
  proposalMessage: {
    type: String,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  projectTitle:{
    type: String,
    required: true,
  },
   status: {
    type: String,
    enum: ['pending', 'accepted', 'denied'],
    default: 'pending',
  },
});

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);
