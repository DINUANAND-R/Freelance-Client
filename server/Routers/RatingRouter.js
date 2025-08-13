const express = require('express');
const router = express.Router();
const Rating = require('../Modules/Rating'); // Adjust the path to your Rating model

// Submit or update a rating
router.post('/rate', async (req, res) => {
  const { rating, comment, freelancerEmail, clientEmail } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  if (!freelancerEmail || !clientEmail) {
    return res.status(400).json({ message: 'Freelancer email and client email are required' });
  }

  try {
    // Check if rating by this client for this freelancer already exists
    const existingRating = await Rating.findOne({ freelancerEmail, clientEmail });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment;
      existingRating.date = new Date();
      await existingRating.save();

      return res.status(200).json({ message: 'Rating updated successfully' });
    } else {
      // Create new rating
      const newRating = new Rating({
        rating,
        comment: comment || '',
        freelancerEmail,
        clientEmail,
      });

      await newRating.save();
      return res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get average rating and all ratings for a freelancer
router.get('/ratings/:freelancerEmail', async (req, res) => {
  try {
    const { freelancerEmail } = req.params;

    const ratings = await Rating.find({ freelancerEmail });

    if (ratings.length === 0) {
      return res.json({ averageRating: null, ratings: [] });
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = (sum / ratings.length).toFixed(2);

    res.json({ averageRating, ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/average/:freelancerEmail', async (req, res) => {
  const { freelancerEmail } = req.params;
  try {
    const result = await Rating.aggregate([
      { $match: { freelancerEmail } },
      {
        $group: {
          _id: '$freelancerEmail',
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    if (result.length === 0) {
      return res.json({ averageRating: 0, count: 0 });
    }
    res.json({
      averageRating: result[0].averageRating.toFixed(2), // round to 2 decimals
      count: result[0].count
    });
  } catch (err) {
    console.error('Error getting average rating:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
