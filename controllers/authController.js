// controllers/authController.js
const { User, RefreshToken } = require('../models');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema, refreshSchema } = require('../validations/authValidation');

const secretKey = process.env.JWT_SECRET || 'secret';
const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'secret_refresh';

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

    // Generate access token (expires in 1 hour)
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    
    // Generate refresh token (expires in 7 days)
    const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: '7d' });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // Save refresh token in the DB
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiryDate
    });

    res.status(200).json({ message: 'Login successful', accessToken: token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    // Validate the incoming refresh token payload
    const { error, value } = refreshSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { refreshToken } = value;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    // Verify the refresh token's signature
    jwt.verify(refreshToken, refreshSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token signature' });
      }

      // Find the refresh token in the database
      const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
      if (!storedToken) return res.status(403).json({ error: 'Invalid refresh token' });

      // Check if the refresh token is expired
      if (storedToken.expiryDate < new Date()) {
        await storedToken.destroy();
        return res.status(403).json({ error: 'Refresh token expired' });
      }

      // Retrieve the user associated with the refresh token
      const user = await User.findByPk(storedToken.userId);
      if (!user) return res.status(403).json({ error: 'Invalid user' });

      // Generate new tokens
      const newAccessToken = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
      const newRefreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: '7d' });
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 7);

      // Save the new refresh token and remove the old one
      await RefreshToken.create({
        token: newRefreshToken,
        userId: user.id,
        expiryDate: newExpiryDate
      });
      await RefreshToken.destroy({ where: { token: refreshToken } });

      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
