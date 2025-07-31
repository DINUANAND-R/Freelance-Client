// ✅ Routers/ClientRouter.js
const express = require('express');
const router = express.Router();
const Client=require('../Modules/ClientModule')
const multer = require('multer');
const {
  registerClient,
  loginClient,
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

router.post('/register', upload.single('photo'), registerClient);
router.post('/login', loginClient);

module.exports = router;