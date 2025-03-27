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

// Optional: Route to get a specific user by ID (for visitor access)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ['id', 'username', 'email', 'bio', 'website', 'createdAt', 'updatedAt']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
