// ✅ Routers/ClientRouter.js
const express = require('express');
const router = express.Router();
const Client=require('../Modules/ClientModule')
const multer = require('multer');
const {
  registerClient,
  loginClient,
  getClientProfile
} = require('../Controllers/ClientController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/all', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Delete client by email (no encode/decode)
router.delete('/delete/:email', async (req, res) => {
  try {
    const { email } = req.params; // directly use from URL

    const deletedClient = await Client.findOneAndDelete({ email });

    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully', deletedClient });
  } catch (error) {
    console.error('Error deleting Client:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





// ✅ Routes/ClientRoutes.js (example)
router.get('/login-activity/:email', async (req, res) => {
  try {
    const client = await Client.findOne({ email: req.params.email }).select('loginHistory');
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    // Return array of dates (ISO strings)
    res.json(client.loginHistory);
  } catch (err) {
    console.error('Error fetching login activity:', err);
    res.status(500).json({ error: 'Server error fetching login activity' });
  }
});

router.post('/register', upload.single('photo'), registerClient);
router.post('/login', loginClient);
router.get('/profile/:email', getClientProfile);

module.exports = router;