const Flow = require('../models/Flow');

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Flow.find({ isTemplate: true });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get template by category
exports.getTemplatesByCategory = async (req, res) => {
  try {
    const templates = await Flow.find({ 
      isTemplate: true,
      category: req.params.category 
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a template
exports.createTemplate = async (req, res) => {
  try {
    const template = new Flow({
      ...req.body,
      isTemplate: true,
      createdBy: req.user.id
    });
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Flow.findById(req.params.id);
    if (!template || !template.isTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    Object.assign(template, req.body);
    template.updatedAt = Date.now();
    
    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Flow.findById(req.params.id);
    if (!template || !template.isTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await template.deleteOne();
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 