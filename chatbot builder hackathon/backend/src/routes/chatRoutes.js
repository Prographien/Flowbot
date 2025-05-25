const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Initialize chat session
router.post('/initialize', chatController.initializeChat);

// Process chat message
router.post('/message', chatController.processMessage);

module.exports = router; 