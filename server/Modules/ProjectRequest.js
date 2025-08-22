// models/ProjectRequest.js
const mongoose = require('mongoose');

// Define a sub-schema for the team member
const teamMemberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const projectRequestSchema = new mongoose.Schema({
  freelancerName: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
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
  projectTitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'denied'],
    default: 'pending',
  },
  teamMeets: {
    // Change this to an array of objects with email and name
    type: [teamMemberSchema],
    default: [],
  }
});

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);