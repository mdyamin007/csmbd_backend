const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { User } = require('../models');

// Get current user profile
router.get('/me', authMiddleware, userController.getProfile);

// Update user profile
router.put('/me', authMiddleware, userController.updateProfile);

// Optional: Route to get a list of all registered users (for visitor access)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'createdAt'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
