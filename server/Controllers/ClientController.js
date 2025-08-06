
// ✅ Controllers/ClientController.js
const Client = require('../Modules/ClientModule');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerClient = async (req, res) => {
  const { name, email, address, password, linkedin } = req.body;
  const photo = req.file?.path;

  try {
    const existing = await Client.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Client already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = new Client({
      name,
      email,
      address,
      password: hashedPassword,
      linkedin,
      photo,
    });

    await client.save();
    res.status(201).json({ message: 'Client registered successfully', client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      client: {
        name: client.name,
        email: client.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getClientProfile = async (req, res) => {
  const { email } = req.params;

  try {
    const client = await Client.findOne({ email }).select('-password');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
