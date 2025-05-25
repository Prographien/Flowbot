# 🔌 Integration Guide

This guide explains how to integrate your chatbot with various platforms and services.

## Table of Contents
- [OpenAI Integration](#openai-integration)
- [Website Integration](#website-integration)
- [Custom Backend Integration](#custom-backend-integration)

## OpenAI Integration

### Setup
1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com)
2. Add the API key to your `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Usage
The chatbot uses OpenAI's GPT-3.5-turbo model by default. You can customize:
- Model selection
- Temperature
- System prompts
- Context handling

Example configuration in your flow:
```json
{
  "type": "ai_node",
  "settings": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "systemPrompt": "You are a helpful customer service agent..."
  }
}
```

## Website Integration

### Using the JavaScript SDK
1. Include the SDK in your HTML:
   ```html
   <script src="https://cdn.yourservice.com/chatbot-sdk.js"></script>
   ```

2. Initialize the chatbot:
   ```javascript
   const chatbot = new ChatbotSDK({
     flowId: 'your_flow_id',
     container: '#chatbot-container',
     theme: {
       primaryColor: '#007bff',
       fontFamily: 'Arial'
     }
   });
   ```

3. Handle events:
   ```javascript
   chatbot.on('message', (message) => {
     console.log('New message:', message);
   });

   chatbot.on('error', (error) => {
     console.error('Chatbot error:', error);
   });
   ```

### Using the React Component
1. Install the package:
   ```bash
   npm install @your-org/chatbot-react
   ```

2. Use the component:
   ```jsx
   import { ChatbotWidget } from '@your-org/chatbot-react';

   function App() {
     return (
       <ChatbotWidget
         flowId="your_flow_id"
         position="bottom-right"
         theme={{
           primaryColor: '#007bff',
           fontFamily: 'Arial'
         }}
       />
     );
   }
   ```

## Custom Backend Integration

### REST API Integration
1. Set up authentication:
   ```javascript
   const response = await fetch('https://api.yourservice.com/auth', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       apiKey: 'your_api_key'
     })
   });
   const { token } = await response.json();
   ```

2. Initialize a chat session:
   ```javascript
   const session = await fetch('https://api.yourservice.com/chat/initialize', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       flowId: 'your_flow_id'
     })
   });
   ```

3. Send/receive messages:
   ```javascript
   const response = await fetch('https://api.yourservice.com/chat/message', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       flowId: 'your_flow_id',
       message: 'User message',
       context: session.context
     })
   });
   ```

### WebSocket Integration
1. Connect to WebSocket:
   ```javascript
   const ws = new WebSocket('wss://api.yourservice.com/chat');
   ```

2. Handle messages:
   ```javascript
   ws.onmessage = (event) => {
     const data = JSON.parse(event.data);
     console.log('Received:', data);
   };
   ```

3. Send messages:
   ```javascript
   ws.send(JSON.stringify({
     type: 'message',
     flowId: 'your_flow_id',
     message: 'User message',
     context: session.context
   }));
   ```

## Security Considerations
1. Always use HTTPS/WSS for production
2. Implement rate limiting
3. Validate all user inputs
4. Use secure session management
5. Keep API keys private
6. Monitor usage and implement alerts 