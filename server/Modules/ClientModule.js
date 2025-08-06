// ✅ Modules/ClientModule.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  linkedin: { type: String },
  photo: { type: String },
  loginHistory: [Date],
  role: { type: String, default: 'Client' } // ✅ Added role with default
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
