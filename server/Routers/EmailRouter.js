const express = require('express');
const sendMail = require('../Mailer/SendMail');

const router = express.Router();

router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await sendMail(to, subject, text);
    res.status(200).json({ message: '✅ Email sent successfully' });
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    res.status(500).json({ message: 'Email sending failed', error: error.message });
  }
});

module.exports = router;
