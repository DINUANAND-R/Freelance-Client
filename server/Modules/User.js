const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  // more fields like profileImage, role, etc.
});

module.exports = mongoose.model('User', userSchema);
