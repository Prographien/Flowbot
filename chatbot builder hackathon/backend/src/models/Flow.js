const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  content: String,
  options: [String],
  next: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  position: {
    x: Number,
    y: Number
  }
});

const flowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  nodes: [nodeSchema],
  edges: [{
    source: String,
    target: String,
    condition: String
  }],
  createdBy: { type: String, required: true },
  isTemplate: { type: Boolean, default: false },
  category: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flow', flowSchema); 