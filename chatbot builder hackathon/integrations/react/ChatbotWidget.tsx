import React, { useEffect, useRef } from 'react';
import ChatbotSDK from '../web-sdk/chatbot-sdk';

interface ChatbotWidgetProps {
  flowId: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: {
    primaryColor?: string;
    fontFamily?: string;
    buttonColor?: string;
    messageColor?: string;
    userMessageBg?: string;
    botMessageBg?: string;
  };
  onMessage?: (message: { type: string; content: string }) => void;
  onError?: (error: any) => void;
  onReady?: () => void;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  flowId,
  position = 'bottom-right',
  theme,
  onMessage,
  onError,
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize chatbot
    chatbotRef.current = new ChatbotSDK({
      flowId,
      container: containerRef.current,
      position,
      theme,
    });

    // Add event listeners
    if (onMessage) {
      chatbotRef.current.on('message', onMessage);
    }
    if (onError) {
      chatbotRef.current.on('error', onError);
    }
    if (onReady) {
      chatbotRef.current.on('ready', onReady);
    }

    // Cleanup
    return () => {
      if (onMessage) {
        chatbotRef.current.off('message', onMessage);
      }
      if (onError) {
        chatbotRef.current.off('error', onError);
      }
      if (onReady) {
        chatbotRef.current.off('ready', onReady);
      }
    };
  }, [flowId, position, theme, onMessage, onError, onReady]);

  return <div ref={containerRef} />;
};

export default ChatbotWidget; 