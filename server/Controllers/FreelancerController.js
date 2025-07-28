import Freelancer from '../Modules/FreelancerModule';
import bcrypt from 'bcrypt';

export const registerFreelancer = async (req, res) => {
  try {
    const { name, email, password, skills, linkedin, github } = req.body;
    const profileImage = req.file ? req.file.filename : null;

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
