const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  freelancerEmail: { type: String, required: true },
  clientEmail: { type: String, required: true },
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
