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

// ✅ Routes/ClientRoutes.js (example)
router.get('/login-history/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const client = await Client.findOne({ email });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(200).json({ loginHistory: client.loginHistory });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/register', upload.single('photo'), registerClient);
router.post('/login', loginClient);
router.get('/profile/:email', getClientProfile);

module.exports = router;