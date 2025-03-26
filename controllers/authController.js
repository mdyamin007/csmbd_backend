const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validations/authValidation');

const secretKey = process.env.JWT_SECRET || 'secret';

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email, password } = value;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Email already registered' });

    const newUser = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = value;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
