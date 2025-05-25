const Flow = require('../models/Flow');

// Get all flows
exports.getFlows = async (req, res) => {
  try {
    const flows = await Flow.find({ createdBy: req.user.id });
    res.json(flows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single flow
exports.getFlow = async (req, res) => {
  try {
    const flow = await Flow.findById(req.params.id);
    if (!flow) {
      return res.status(404).json({ message: 'Flow not found' });
    }
    res.json(flow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new flow
exports.createFlow = async (req, res) => {
  try {
    const flow = new Flow({
      ...req.body,
      createdBy: req.user.id
    });
    const newFlow = await flow.save();
    res.status(201).json(newFlow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a flow
exports.updateFlow = async (req, res) => {
  try {
    const flow = await Flow.findById(req.params.id);
    if (!flow) {
      return res.status(404).json({ message: 'Flow not found' });
    }
    
    if (flow.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(flow, req.body);
    flow.updatedAt = Date.now();
    
    const updatedFlow = await flow.save();
    res.json(updatedFlow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a flow
exports.deleteFlow = async (req, res) => {
  try {
    const flow = await Flow.findById(req.params.id);
    if (!flow) {
      return res.status(404).json({ message: 'Flow not found' });
    }

    if (flow.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await flow.remove();
    res.json({ message: 'Flow deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clone a template
exports.cloneTemplate = async (req, res) => {
  try {
    const template = await Flow.findById(req.params.id);
    if (!template || !template.isTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const newFlow = new Flow({
      ...template.toObject(),
      _id: undefined,
      isTemplate: false,
      createdBy: req.user.id,
      name: `${template.name} Copy`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const savedFlow = await newFlow.save();
    res.status(201).json(savedFlow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 