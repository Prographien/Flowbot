const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flowController');

// Get all flows
router.get('/', flowController.getFlows);

// Get a single flow
router.get('/:id', flowController.getFlow);

// Create a new flow
router.post('/', flowController.createFlow);

// Update a flow
router.put('/:id', flowController.updateFlow);

// Delete a flow
router.delete('/:id', flowController.deleteFlow);

// Clone a template
router.post('/template/:id/clone', flowController.cloneTemplate);

module.exports = router; 