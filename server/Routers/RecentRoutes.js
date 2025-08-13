// routes/activityRoutes.js
const express = require('express');
const router = express.Router();

const Activity = require('../Modules/RecentActivity');

// Get recent activity for a client by email
router.get('/recent-activity/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const activities = await Activity.find({ clientEmail: email })
      .sort({ date: -1 }) // newest first
      .limit(10); // limit to 10 recent activities
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
