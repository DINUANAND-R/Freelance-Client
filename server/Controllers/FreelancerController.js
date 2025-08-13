import Freelancer from '../Modules/FreelancerModule.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import path from 'path';

// ✅ Configure Nodemailer (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const registerFreelancer = async (req, res) => {
  try {
    const { name, email, password, skills, linkedin, github } = req.body;
    const profileImage = req.file ? path.normalize(req.file.filename) : null;

    const existingFreelancer = await Freelancer.findOne({ email });
    if (existingFreelancer) {
      return res.status(400).json({ message: 'Freelancer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFreelancer = new Freelancer({
      name,
      email,
      password: hashedPassword,
      skills: JSON.parse(skills), // sent as JSON string
      linkedin,
      github,
      profileImage,
    });

    await newFreelancer.save();

    // 📧 Send Welcome Email (non-blocking)
    transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Welcome to Our Freelancer Platform!',
      text: `Hello ${name},\n\nYour freelancer account has been successfully created.\n\nHappy freelancing! 🚀`
    }).then(() => {
      console.log(`📧 Email sent to ${email}`);
    }).catch((err) => {
      console.error('❌ Failed to send email:', err);
    });

    res.status(201).json({ message: 'Freelancer registered successfully' });
  } catch (error) {
    console.error('Error registering freelancer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginFreelancer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const freelancer = await Freelancer.findOne({ email });
    if (!freelancer) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, freelancer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.json({
      freelancerID: freelancer._id,
      name: freelancer.name,
      email: freelancer.email,
      image: freelancer.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
