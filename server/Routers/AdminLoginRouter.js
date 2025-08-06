const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../Controllers/AdminController');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // Remove after first use or protect it

module.exports = router;
