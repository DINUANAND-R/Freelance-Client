const mongoose = require('mongoose');

// Schema for a single task assigned to a team member.
const TaskSchema = new mongoose.Schema({
    projectId: { 
    type: String, 
    required: true 
  },
  leaderEmail: { 
    type: String, 
    required: true 
  },
  leaderName: { 
    type: String, 
    required: true 
  },
  freelancerEmail: { 
    type: String, 
    required: true 
  },
  freelancerName: { 
    type: String, 
    required: true 
  },
  task: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  },
  assignedAt: { 
    type: Date, 
    default: Date.now 
  },
});
const Task =mongoose.model("Task",TaskSchema);

module.exports = Task;

