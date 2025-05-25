const OpenAI = require('openai');
const Flow = require('../models/Flow');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Process chat message
exports.processMessage = async (req, res) => {
  try {
    const { flowId, message, context } = req.body;
    
    // Get the flow
    const flow = await Flow.findById(flowId);
    if (!flow) {
      return res.status(404).json({ message: 'Flow not found' });
    }

    // Find the appropriate node based on context
    const currentNode = flow.nodes.find(node => node.id === context.currentNodeId);
    if (!currentNode) {
      return res.status(404).json({ message: 'Node not found' });
    }

    // Process with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are a chatbot following this flow: ${JSON.stringify(currentNode)}. 
                   Respond according to the flow's logic and maintain conversation context.`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    // Get next node based on AI response
    const response = completion.choices[0].message.content;
    const nextNodeId = determineNextNode(flow, currentNode, response);

    res.json({
      response,
      nextNodeId,
      context: {
        ...context,
        currentNodeId: nextNodeId
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize chat session
exports.initializeChat = async (req, res) => {
  try {
    const { flowId } = req.body;
    
    const flow = await Flow.findById(flowId);
    if (!flow) {
      return res.status(404).json({ message: 'Flow not found' });
    }

    // Find start node
    const startNode = flow.nodes.find(node => node.type === 'start');
    if (!startNode) {
      return res.status(400).json({ message: 'Invalid flow: no start node found' });
    }

    res.json({
      flowId,
      context: {
        currentNodeId: startNode.id,
        variables: {}
      },
      initialMessage: startNode.content || "Hello! How can I help you today?"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to determine next node
function determineNextNode(flow, currentNode, response) {
  if (!currentNode.next) {
    return null;
  }

  if (typeof currentNode.next === 'string') {
    return currentNode.next;
  }

  // Handle conditional logic here
  const edges = flow.edges.filter(edge => edge.source === currentNode.id);
  if (edges.length === 0) {
    return null;
  }

  // For now, just return the first edge's target
  // In a full implementation, you'd analyze the response and conditions
  return edges[0].target;
} 