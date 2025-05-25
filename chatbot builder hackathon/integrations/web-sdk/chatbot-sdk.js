class ChatbotSDK {
  constructor(config) {
    this.config = {
      flowId: null,
      container: '#chatbot-container',
      apiUrl: 'http://localhost:5000/api',
      theme: {
        primaryColor: '#007bff',
        fontFamily: 'Arial',
        buttonColor: '#007bff',
        messageColor: '#333',
        userMessageBg: '#e3f2fd',
        botMessageBg: '#f5f5f5',
      },
      position: 'bottom-right',
      ...config,
    };

    this.context = null;
    this.eventHandlers = {
      message: [],
      error: [],
      ready: [],
    };

    this.init();
  }

  init() {
    // Create container if not exists
    this.createContainer();
    
    // Initialize chat session
    this.initializeChat();

    // Add styles
    this.addStyles();

    // Add event listeners
    this.addEventListeners();

    // Emit ready event
    this.emit('ready');
  }

  createContainer() {
    if (typeof this.config.container === 'string') {
      this.container = document.querySelector(this.config.container);
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = this.config.container.replace('#', '');
        document.body.appendChild(this.container);
      }
    } else {
      this.container = this.config.container;
    }

    // Set container styles based on position
    this.container.style.position = 'fixed';
    this.container.style.zIndex = '9999';
    
    switch (this.config.position) {
      case 'bottom-right':
        this.container.style.bottom = '20px';
        this.container.style.right = '20px';
        break;
      case 'bottom-left':
        this.container.style.bottom = '20px';
        this.container.style.left = '20px';
        break;
      case 'top-right':
        this.container.style.top = '20px';
        this.container.style.right = '20px';
        break;
      case 'top-left':
        this.container.style.top = '20px';
        this.container.style.left = '20px';
        break;
    }

    // Create chat interface
    this.container.innerHTML = `
      <div class="chatbot-widget">
        <div class="chatbot-header">
          <span class="chatbot-title">Chat Support</span>
          <button class="chatbot-toggle">×</button>
        </div>
        <div class="chatbot-messages"></div>
        <div class="chatbot-input">
          <textarea placeholder="Type a message..."></textarea>
          <button class="chatbot-send">Send</button>
        </div>
      </div>
    `;
  }

  addStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .chatbot-widget {
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        font-family: ${this.config.theme.fontFamily};
      }

      .chatbot-header {
        padding: 15px;
        background: ${this.config.theme.primaryColor};
        color: white;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chatbot-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
      }

      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .chatbot-message {
        max-width: 80%;
        padding: 10px;
        border-radius: 10px;
        margin: 5px 0;
      }

      .chatbot-message.user {
        background: ${this.config.theme.userMessageBg};
        align-self: flex-end;
      }

      .chatbot-message.bot {
        background: ${this.config.theme.botMessageBg};
        align-self: flex-start;
      }

      .chatbot-input {
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
      }

      .chatbot-input textarea {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
        resize: none;
        font-family: inherit;
      }

      .chatbot-send {
        padding: 8px 15px;
        background: ${this.config.theme.buttonColor};
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .chatbot-send:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(styles);
  }

  addEventListeners() {
    const textarea = this.container.querySelector('textarea');
    const sendButton = this.container.querySelector('.chatbot-send');
    const toggleButton = this.container.querySelector('.chatbot-toggle');

    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage(textarea.value);
        textarea.value = '';
      }
    });

    sendButton.addEventListener('click', () => {
      this.sendMessage(textarea.value);
      textarea.value = '';
    });

    toggleButton.addEventListener('click', () => {
      const widget = this.container.querySelector('.chatbot-widget');
      widget.style.display = widget.style.display === 'none' ? 'flex' : 'none';
    });
  }

  async initializeChat() {
    try {
      const response = await fetch(`${this.config.apiUrl}/chat/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flowId: this.config.flowId,
        }),
      });

      const data = await response.json();
      this.context = data.context;

      if (data.initialMessage) {
        this.addMessage(data.initialMessage, 'bot');
      }
    } catch (error) {
      this.emit('error', error);
    }
  }

  async sendMessage(message) {
    if (!message.trim() || !this.context) return;

    this.addMessage(message, 'user');

    try {
      const response = await fetch(`${this.config.apiUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flowId: this.config.flowId,
          message,
          context: this.context,
        }),
      });

      const data = await response.json();
      this.context = data.context;
      this.addMessage(data.response, 'bot');
      this.emit('message', { type: 'bot', content: data.response });
    } catch (error) {
      this.emit('error', error);
      this.addMessage('Sorry, there was an error processing your message.', 'bot');
    }
  }

  addMessage(text, sender) {
    const messagesContainer = this.container.querySelector('.chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${sender}`;
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  on(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].push(handler);
    }
  }

  off(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        (h) => h !== handler
      );
    }
  }

  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((handler) => handler(data));
    }
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatbotSDK;
} else if (typeof define === 'function' && define.amd) {
  define([], () => ChatbotSDK);
} else {
  window.ChatbotSDK = ChatbotSDK;
} 