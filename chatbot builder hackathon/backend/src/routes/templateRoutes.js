const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Get all templates
router.get('/', templateController.getTemplates);

// Get templates by category
router.get('/category/:category', templateController.getTemplatesByCategory);

// Create a template
router.post('/', templateController.createTemplate);

// Update a template
router.put('/:id', templateController.updateTemplate);

// Delete a template
router.delete('/:id', templateController.deleteTemplate);

module.exports = router; 