const express = require('express');
const router = express.Router();
const Message = require('../Modules/Message');

// Save a new message
router.post('/send', async (req, res) => {
  const { senderEmail, receiverEmail, messageText } = req.body;
  if (!senderEmail || !receiverEmail || !messageText) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const message = new Message({ senderEmail, receiverEmail, messageText });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('❌ Message save error:', err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


// Get all messages between two users
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderEmail: user1, receiverEmail: user2 },
        { senderEmail: user2, receiverEmail: user1 },
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
