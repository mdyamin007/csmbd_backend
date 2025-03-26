const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

// Create new content (only for authenticated users)
router.post('/', authMiddleware, contentController.createContent);

// Update content (only owner can update)
router.put('/:id', authMiddleware, contentController.updateContent);

// Get content by user id (publicly viewable)
router.get('/user/:userId', contentController.getUserContents);

module.exports = router;
