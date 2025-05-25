# Chatbot Templates

This directory contains pre-built templates for common chatbot use cases. These templates can be used as starting points for creating custom chatbots.

## Available Templates

### 1. Customer Service Bot
- **File:** `customer-service.json`
- **Description:** A template for handling common customer service inquiries
- **Features:**
  - Intent classification
  - Order status inquiries
  - Returns processing
  - Product information
  - Shipping inquiries
  - General help

### 2. Lead Generation Bot
- **File:** `lead-generation.json`
- **Description:** A template for capturing and qualifying leads
- **Features:**
  - Interest/pain point capture
  - Contact information collection
  - Lead qualification
  - Meeting scheduling
  - Resource sharing
  - Lead nurturing

### 3. FAQ Bot
- **File:** `faq-bot.json`
- **Description:** A template for answering frequently asked questions
- **Features:**
  - Topic classification
  - FAQ database search
  - Answer relevance checking
  - Follow-up questions
  - Agent transfer for complex queries

## Template Structure

Each template follows this structure:
```json
{
  "name": "Template Name",
  "description": "Template description",
  "category": "template_category",
  "nodes": [
    {
      "id": "node_id",
      "type": "node_type",
      "position": { "x": 0, "y": 0 },
      "data": {
        "label": "Node Label",
        "content": "Node Content",
        "settings": {
          // Optional AI settings
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge_id",
      "source": "source_node_id",
      "target": "target_node_id",
      "data": {
        "condition": "optional_condition"
      }
    }
  ]
}
```

## Node Types

1. **start**
   - Entry point of the flow
   - Contains welcome message

2. **message**
   - Static message node
   - Used for fixed responses

3. **ai**
   - AI-powered node
   - Customizable with model settings
   - Used for dynamic responses

4. **condition**
   - Decision node
   - Routes conversation based on conditions

5. **end**
   - Exit point of the flow
   - Contains farewell message

## Using Templates

1. Choose a template that matches your use case
2. Import it into the flow builder
3. Customize the nodes and messages
4. Add or modify edges for flow control
5. Test the flow in the chat preview
6. Deploy when ready

## Customization Tips

1. **AI Nodes:**
   - Adjust temperature for creativity vs precision
   - Customize prompts for your domain
   - Add context for better responses

2. **Flow Structure:**
   - Add error handling paths
   - Include confirmation steps
   - Consider edge cases

3. **Messages:**
   - Maintain consistent tone
   - Include clear calls to action
   - Add variables for personalization

## Contributing

To add a new template:
1. Create a new JSON file
2. Follow the template structure
3. Add comprehensive documentation
4. Test thoroughly
5. Submit a pull request 