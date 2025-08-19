// ✅ Controllers/ClientController.js
const Client = require('../Modules/ClientModule');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// ✅ Register Client
exports.registerClient = async (req, res) => {
  const { name, email, address, password, linkedin } = req.body;
  const photo = req.file ? path.normalize(req.file.path) : null;

  try {
    // Check if client already exists
    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Client already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new client
    const client = new Client({
      name,
      email,
      address,
      password: hashedPassword,
      linkedin,
      photo,
      loginHistory: []
    });

    await client.save();

    // Send welcome email (non-blocking)
    transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Welcome to Our Platform!',
      text: `Hello ${name},\n\nYour account has been successfully created.\n\nThank you for joining us!`
    }).then(() => {
      console.log(`📧 Email sent to ${email}`);
    }).catch((err) => {
      console.error('❌ Failed to send email:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Client registered successfully',
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        address: client.address,
        linkedin: client.linkedin,
        photo: client.photo
      }
    });

  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Login Client
exports.loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Track login history
    client.loginHistory.push(new Date());
    if (client.loginHistory.length > 20) {
      client.loginHistory.shift(); // keep only latest 20
    }
    await client.save();

    // Generate JWT
    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      client: {
        name: client.name,
        email: client.email
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Get Client Profile
exports.getClientProfile = async (req, res) => {
  const { email } = req.params;

  try {
    const client = await Client.findOne({ email }).select('-password');
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({ success: true, client });

  } catch (err) {
    console.error('❌ Profile fetch error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
