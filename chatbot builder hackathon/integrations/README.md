# Chatbot Builder Integrations

This directory contains various integration options for the chatbot builder platform.

## Web SDK

The Web SDK allows you to easily integrate the chatbot into any website using vanilla JavaScript.

### Installation

```html
<script src="https://cdn.yourservice.com/chatbot-sdk.js"></script>
```

### Usage

```javascript
const chatbot = new ChatbotSDK({
  flowId: 'your_flow_id',
  container: '#chatbot-container',
  theme: {
    primaryColor: '#007bff',
    fontFamily: 'Arial'
  }
});

// Handle events
chatbot.on('message', (message) => {
  console.log('New message:', message);
});

chatbot.on('error', (error) => {
  console.error('Chatbot error:', error);
});
```

### Configuration Options

- `flowId` (required): The ID of your chatbot flow
- `container`: CSS selector or DOM element for the chatbot container
- `position`: Widget position ('bottom-right', 'bottom-left', 'top-right', 'top-left')
- `theme`: Customize the appearance
  - `primaryColor`: Main color for headers and buttons
  - `fontFamily`: Font family for the widget
  - `buttonColor`: Color for action buttons
  - `messageColor`: Text color for messages
  - `userMessageBg`: Background color for user messages
  - `botMessageBg`: Background color for bot messages

## React Component

A React component wrapper for the chatbot SDK.

### Installation

```bash
npm install @chatbot-builder/react
```

### Usage

```jsx
import { ChatbotWidget } from '@chatbot-builder/react';

function App() {
  const handleMessage = (message) => {
    console.log('New message:', message);
  };

  const handleError = (error) => {
    console.error('Chatbot error:', error);
  };

  return (
    <ChatbotWidget
      flowId="your_flow_id"
      position="bottom-right"
      theme={{
        primaryColor: '#007bff',
        fontFamily: 'Arial'
      }}
      onMessage={handleMessage}
      onError={handleError}
    />
  );
}
```

### Props

- `flowId` (required): The ID of your chatbot flow
- `position`: Widget position ('bottom-right', 'bottom-left', 'top-right', 'top-left')
- `theme`: Theme customization options
- `onMessage`: Callback for new messages
- `onError`: Error handling callback
- `onReady`: Callback when the widget is ready

## Security Considerations

1. Always use HTTPS in production
2. Implement proper authentication
3. Set up CORS policies
4. Rate limit API requests
5. Validate user input
6. Monitor usage for abuse

## Support

For issues and feature requests, please visit our GitHub repository or contact support. 